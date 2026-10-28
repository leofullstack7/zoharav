/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

/**
 * One-off, idempotent seed script for the admin CRM product demo. Inserts:
 *
 *   1. Twelve historical, fake-but-realistic consultations (May–October
 *      2026), each as a matching `availability_slots` row (is_booked = true)
 *      plus its `bookings` row with `outcome`, `summary`, `key_points`,
 *      `deals_consolidated`, and `deal_value` filled in — so the admin
 *      dashboard and CRM board have real variety to show in a walkthrough.
 *   2. ~20 scattered, unbooked future slots between today and end of
 *      December 2026, so the chat widget's booking modal and the admin's
 *      availability list both have a realistic set of open options.
 *
 * This is internal admin-only demo data. It is never read by any
 * public-facing route — it only ever appears inside /admin.
 *
 * Idempotency: re-running this script does not duplicate rows. Each demo
 * booking is keyed by its (fictional) client email — if a booking with that
 * email already exists, it's skipped. Each future slot is keyed by its
 * exact `starts_at` — if a slot already exists at that instant, it's
 * skipped.
 *
 * Mirrors scripts/migrate.cjs's env-loading / connection setup exactly.
 *
 * Usage: node scripts/seed-demo-bookings.cjs
 */

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  const contents = fs.readFileSync(envPath, "utf8");
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const connectionString = process.env.POSTGRES_URL_NON_POOLING;
if (!connectionString) {
  console.error("POSTGRES_URL_NON_POOLING is not set. Aborting seed.");
  process.exit(1);
}

const SUPABASE_CA = `-----BEGIN CERTIFICATE-----
MIIDxDCCAqygAwIBAgIUbLxMod62P2ktCiAkxnKJwtE9VPYwDQYJKoZIhvcNAQEL
BQAwazELMAkGA1UEBhMCVVMxEDAOBgNVBAgMB0RlbHdhcmUxEzARBgNVBAcMCk5l
dyBDYXN0bGUxFTATBgNVBAoMDFN1cGFiYXNlIEluYzEeMBwGA1UEAwwVU3VwYWJh
c2UgUm9vdCAyMDIxIENBMB4XDTIxMDQyODEwNTY1M1oXDTMxMDQyNjEwNTY1M1ow
azELMAkGA1UEBhMCVVMxEDAOBgNVBAgMB0RlbHdhcmUxEzARBgNVBAcMCk5ldyBD
YXN0bGUxFTATBgNVBAoMDFN1cGFiYXNlIEluYzEeMBwGA1UEAwwVU3VwYWJhc2Ug
Um9vdCAyMDIxIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqQXW
QyHOB+qR2GJobCq/CBmQ40G0oDmCC3mzVnn8sv4XNeWtE5XcEL0uVih7Jo4Dkx1Q
DmGHBH1zDfgs2qXiLb6xpw/CKQPypZW1JssOTMIfQppNQ87K75Ya0p25Y3ePS2t2
GtvHxNjUV6kjOZjEn2yWEcBdpOVCUYBVFBNMB4YBHkNRDa/+S4uywAoaTWnCJLUi
cvTlHmMw6xSQQn1UfRQHk50DMCEJ7Cy1RxrZJrkXXRP3LqQL2ijJ6F4yMfh+Gyb4
O4XajoVj/+R4GwywKYrrS8PrSNtwxr5StlQO8zIQUSMiq26wM8mgELFlS/32Uclt
NaQ1xBRizkzpZct9DwIDAQABo2AwXjALBgNVHQ8EBAMCAQYwHQYDVR0OBBYEFKjX
uXY32CztkhImng4yJNUtaUYsMB8GA1UdIwQYMBaAFKjXuXY32CztkhImng4yJNUt
aUYsMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAB8spzNn+4VU
tVxbdMaX+39Z50sc7uATmus16jmmHjhIHz+l/9GlJ5KqAMOx26mPZgfzG7oneL2b
VW+WgYUkTT3XEPFWnTp2RJwQao8/tYPXWEJDc0WVQHrpmnWOFKU/d3MqBgBm5y+6
jB81TU/RG2rVerPDWP+1MMcNNy0491CTL5XQZ7JfDJJ9CCmXSdtTl4uUQnSuv/Qx
Cea13BX2ZgJc7Au30vihLhub52De4P/4gonKsNHYdbWjg7OWKwNv/zitGDVDB9Y2
CMTyZKG3XEu5Ghl1LEnI3QmEKsqaCLv12BnVjbkSeZsMnevJPs1Ye6TjjJwdik5P
o/bKiIz+Fq8=
-----END CERTIFICATE-----`;

function buildClientConfig(rawConnectionString) {
  const url = new URL(rawConnectionString);
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 5432,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, "") || "postgres",
    ssl: { ca: SUPABASE_CA },
  };
}

// Fixed "today" for seeding purposes — the real service lines and the demo
// narrative (5 months of past consultations, open slots through December)
// are anchored to this date rather than the machine's clock, so the seed
// stays reproducible regardless of when this script is actually run.
const BOGOTA_OFFSET = "-05:00"; // America/Bogota, no DST

function at(dateStr, hour, minute) {
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return new Date(`${dateStr}T${hh}:${mm}:00${BOGOTA_OFFSET}`);
}

// --- 12 historical demo consultations ---------------------------------
// One topic string per real service line (content/services.ts), spread
// unevenly across late May–mid October 2026. 9 effective, 3 not_realized.
const DEMO_BOOKINGS = [
  {
    startsAt: at("2026-05-19", 9, 30),
    name: "Mariana Duarte",
    company: "Grupo Energético del Istmo",
    email: "mariana.duarte@energeticoistmo.com",
    phone: "+507 6412-0938",
    topic: "Transición energética y descarbonización",
    outcome: "effective",
    summary:
      "Se revisó la hoja de ruta de descarbonización del grupo para sus activos térmicos en Panamá, con énfasis en la secuencia de retiro y su sustitución por generación renovable firme.",
    keyPoints:
      "Priorización de activos por intensidad de carbono, encaje regulatorio para contratos de compra de energía (PPA) y condiciones de financiamiento verde disponibles en la región.",
    dealsConsolidated:
      "Se acordó un alcance de diagnóstico de descarbonización a tres meses, con entrega de un caso de inversión preliminar.",
    dealValue: 18000,
  },
  {
    startsAt: at("2026-05-27", 15, 0),
    name: "Rodrigo Salcedo",
    company: "Petrolera Andina S.A.",
    email: "rodrigo.salcedo@petroleraandina.ec",
    phone: "+593 99 512 4477",
    topic: "Asesoría en petróleo y energía",
    outcome: "effective",
    summary:
      "Sesión centrada en la eficiencia operativa de campos maduros y en las opciones de reconversión parcial hacia gas natural.",
    keyPoints:
      "Diagnóstico de pérdidas no identificadas en producción, estructura contractual con socios de servicio y riesgo regulatorio en Ecuador.",
    dealsConsolidated:
      "Se consolidó un mandato de asesoría de seis semanas para el diagnóstico operativo de dos campos.",
    dealValue: 24000,
  },
  {
    startsAt: at("2026-06-03", 11, 0),
    name: "Catalina Herrera",
    company: "Compañía Minera del Cauca",
    email: "catalina.herrera@minerodelcauca.co",
    phone: "+57 311 802 1156",
    topic: "Minería y recursos naturales",
    outcome: "effective",
    summary:
      "Consultoría sobre la diligencia del activo aurífero en etapa de exploración avanzada, con foco en título, tenencia y relación comunitaria.",
    keyPoints:
      "Vacíos en el expediente de título, expectativas de línea base ambiental y la necesidad de un acuerdo marco con la comunidad antes de avanzar a desarrollo.",
    dealsConsolidated:
      "Se definió el alcance de una diligencia integral de título y jurisdicción, con entrega de opinión escrita en cuatro semanas.",
    dealValue: 15000,
  },
  {
    startsAt: at("2026-06-16", 14, 30),
    name: "Felipe Montenegro",
    company: "Grupo Agroindustrial del Pacífico",
    email: "felipe.montenegro@agropacifico.pe",
    phone: "+51 989 441 207",
    topic: "Sostenibilidad y ESG",
    outcome: "not_realized",
    summary: "El cliente no se presentó a la sesión. No hubo solicitud de reprogramación.",
    keyPoints: "",
    dealsConsolidated: "",
    dealValue: null,
  },
  {
    startsAt: at("2026-06-29", 10, 0),
    name: "Isabel Londoño",
    company: "Fondo Patrimonial Meridiano",
    email: "isabel.londono@fondomeridiano.com",
    phone: "+57 300 647 2290",
    topic: "Asesoría de inversión y finanzas",
    outcome: "effective",
    summary:
      "Revisión de la tesis de inversión de un vehículo de infraestructura energética, con atención a la estructura de gobierno y al riesgo cambiario.",
    keyPoints:
      "Sensibilidad de retornos ante escenarios de tasa de cambio, condiciones de salida y alineación de incentivos entre socios limitados y socio gestor.",
    dealsConsolidated:
      "Se acordó una segunda fase de estructuración del vehículo, con participación en el comité de inversión.",
    dealValue: 32000,
  },
  {
    startsAt: at("2026-07-08", 16, 0),
    name: "Andrés Pardo",
    company: "Manufacturas Continental S.A.",
    email: "andres.pardo@manufacturascontinental.mx",
    phone: "+52 55 4821 0937",
    topic: "Consultoría estratégica y operativa",
    outcome: "effective",
    summary:
      "Diagnóstico operativo de la planta de Puebla, con foco en los cuellos de botella logísticos y la brecha entre capacidad instalada y demanda real.",
    keyPoints:
      "Brecha entre planeación de producción y ejecución en planta, rotación de personal clave y oportunidades de automatización de bajo riesgo.",
    dealsConsolidated: "Se consolidó un mandato de rediseño operativo a noventa días para la planta de Puebla.",
    dealValue: 21000,
  },
  {
    startsAt: at("2026-07-21", 9, 0),
    name: "Valentina Ríos",
    company: "Hidroeléctrica del Norte",
    email: "valentina.rios@hidronorte.cl",
    phone: "+56 9 8834 1172",
    topic: "Transición energética y descarbonización",
    outcome: "not_realized",
    summary: "Se reagendó la sesión en dos ocasiones pero no hubo seguimiento por parte del cliente.",
    keyPoints: "",
    dealsConsolidated: "",
    dealValue: null,
  },
  {
    startsAt: at("2026-08-04", 13, 30),
    name: "Tomás Restrepo",
    company: "Esmeraldas de los Andes Ltda.",
    email: "tomas.restrepo@esmeraldasandes.co",
    phone: "+57 315 229 8841",
    topic: "Minería y recursos naturales",
    outcome: "effective",
    summary:
      "Asesoría sobre la estrategia de acceso a mercado para un lote de esmeraldas de origen trazable, orientada a compradores internacionales.",
    keyPoints:
      "Requisitos de trazabilidad de compradores europeos, estructura comercial que evita que la firma intermedie la venta y el valor de una certificación de origen responsable.",
    dealsConsolidated: "Se consolidó un mandato de asesoría de acceso a mercado y mapeo de compradores a sesenta días.",
    dealValue: 12000,
  },
  {
    startsAt: at("2026-08-19", 15, 30),
    name: "Camila Esguerra",
    company: "Banca de Inversión Austral",
    email: "camila.esguerra@bancaaustral.com.ar",
    phone: "+54 9 11 6623 4489",
    topic: "Asesoría de inversión y finanzas",
    outcome: "not_realized",
    summary: "El cliente canceló con poca anticipación por un conflicto de agenda y no solicitó una nueva fecha.",
    keyPoints: "",
    dealsConsolidated: "",
    dealValue: null,
  },
  {
    startsAt: at("2026-09-02", 11, 30),
    name: "Juan Pablo Noguera",
    company: "Energía y Gas del Caribe S.A.",
    email: "juanpablo.noguera@energiacaribe.co",
    phone: "+57 301 558 7723",
    topic: "Asesoría en petróleo y energía",
    outcome: "effective",
    summary: "Revisión de la estrategia de contratación de gas natural para el portafolio industrial de la compañía en la costa caribe.",
    keyPoints:
      "Exposición a precios de gas en el corto plazo, opciones de contratos a plazo y la solidez de las contrapartes disponibles en el mercado local.",
    dealsConsolidated: "Se acordó el diseño de una estrategia de cobertura de gas a doce meses.",
    dealValue: 19500,
  },
  {
    startsAt: at("2026-09-22", 10, 30),
    name: "Daniela Ponce",
    company: "Logística Transoceánica",
    email: "daniela.ponce@transoceanica.pa",
    phone: "+507 6298-7741",
    topic: "Consultoría estratégica y operativa",
    outcome: "effective",
    summary: "Sesión sobre la reconfiguración de la red logística multimodal de la empresa entre Panamá y Centroamérica.",
    keyPoints:
      "Costos ocultos en la operación portuaria, redundancia de rutas ante disrupciones y la madurez del sistema de gestión de inventario.",
    dealsConsolidated: "Se consolidó un mandato de rediseño de red logística con entrega de plan a seis meses.",
    dealValue: 27000,
  },
  {
    startsAt: at("2026-10-09", 14, 0),
    name: "Sebastián Quintero",
    company: "Minerales y Sostenibilidad del Chocó",
    email: "sebastian.quintero@mineralesdelchoco.co",
    phone: "+57 320 774 1193",
    topic: "Sostenibilidad y ESG",
    outcome: "effective",
    summary: "Revisión de los estándares ESG exigidos por financiadores internacionales para un proyecto de minerales estratégicos en el Chocó.",
    keyPoints:
      "Brecha entre las prácticas actuales de la empresa y los estándares de desempeño de la banca multilateral, y el peso del cierre de mina en el caso financiero.",
    dealsConsolidated: "Se acordó una hoja de ruta de alineación ESG a cuatro meses, previa a la siguiente ronda de financiamiento.",
    dealValue: 16500,
  },
];

// --- ~20 scattered open future slots, now through end of December 2026 --
const FUTURE_SLOT_TIMES = [
  ["2026-10-30", 10, 0, 60],
  ["2026-11-03", 14, 0, 60],
  ["2026-11-05", 9, 30, 90],
  ["2026-11-06", 16, 0, 60],
  ["2026-11-10", 11, 0, 60],
  ["2026-11-13", 9, 0, 30],
  ["2026-11-17", 15, 30, 60],
  ["2026-11-19", 10, 30, 60],
  ["2026-11-24", 13, 0, 60],
  ["2026-11-26", 9, 0, 60],
  ["2026-12-01", 16, 30, 60],
  ["2026-12-03", 11, 30, 90],
  ["2026-12-04", 9, 30, 60],
  ["2026-12-08", 14, 0, 60],
  ["2026-12-10", 10, 0, 60],
  ["2026-12-14", 15, 0, 60],
  ["2026-12-15", 9, 0, 60],
  ["2026-12-17", 13, 30, 60],
  ["2026-12-21", 11, 0, 60],
  ["2026-12-28", 10, 30, 60],
].map(([date, hour, minute, duration]) => ({ startsAt: at(date, hour, minute), durationMinutes: duration }));

async function main() {
  const client = new Client(buildClientConfig(connectionString));
  await client.connect();

  try {
    let insertedBookings = 0;
    let skippedBookings = 0;

    for (const booking of DEMO_BOOKINGS) {
      const existing = await client.query("select id from bookings where email = $1 limit 1", [booking.email]);
      if (existing.rows.length > 0) {
        skippedBookings += 1;
        console.log(`[skip] booking already exists for ${booking.email}`);
        continue;
      }

      await client.query("begin");
      try {
        const slotResult = await client.query(
          `insert into availability_slots (starts_at, duration_minutes, is_booked)
           values ($1, 60, true)
           returning id`,
          [booking.startsAt.toISOString()],
        );
        const slotId = slotResult.rows[0].id;

        await client.query(
          `insert into bookings
             (slot_id, name, email, phone, topic, source, status, outcome, summary, key_points, deals_consolidated, deal_value, reviewed_at, created_at)
           values ($1, $2, $3, $4, $5, 'demo', 'confirmed', $6, $7, $8, $9, $10, $11, $11)`,
          [
            slotId,
            `${booking.name} — ${booking.company}`,
            booking.email,
            booking.phone,
            booking.topic,
            booking.outcome,
            booking.summary,
            booking.keyPoints,
            booking.dealsConsolidated,
            booking.dealValue,
            booking.startsAt.toISOString(),
          ],
        );
        await client.query("commit");
        insertedBookings += 1;
        console.log(`[seed] booking for ${booking.email} (${booking.outcome})`);
      } catch (err) {
        await client.query("rollback");
        throw err;
      }
    }

    let insertedSlots = 0;
    let skippedSlots = 0;

    for (const slot of FUTURE_SLOT_TIMES) {
      const iso = slot.startsAt.toISOString();
      const existing = await client.query("select id from availability_slots where starts_at = $1 limit 1", [iso]);
      if (existing.rows.length > 0) {
        skippedSlots += 1;
        continue;
      }
      await client.query(
        `insert into availability_slots (starts_at, duration_minutes, is_booked) values ($1, $2, false)`,
        [iso, slot.durationMinutes],
      );
      insertedSlots += 1;
    }

    console.log(
      `\nDemo bookings: ${insertedBookings} inserted, ${skippedBookings} already present.`,
    );
    console.log(`Future open slots: ${insertedSlots} inserted, ${skippedSlots} already present.`);

    // --- Verification ----------------------------------------------------
    const outcomeCounts = await client.query(
      `select coalesce(outcome, 'pending') as outcome, count(*) from bookings group by 1 order by 1`,
    );
    console.log("\nBookings by outcome:", outcomeCounts.rows);

    const futureOpenCount = await client.query(
      `select count(*) from availability_slots where is_booked = false and starts_at > now()`,
    );
    console.log("Future unbooked slots:", futureOpenCount.rows[0].count);

    const sample = await client.query(
      `select name, email, topic, outcome, deal_value from bookings where source = 'demo' order by created_at asc limit 3`,
    );
    console.log("\nSample seeded bookings:", sample.rows);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
