import type { FaqItem, Service } from "../types";

const faqs: FaqItem[] = [
  {
    id: "mining-role",
    category: "service",
    service: "mining-natural-resources",
    showOnHome: false,
    question: {
      en: "Does Zoharav mine, buy, or sell gold, emeralds, or other minerals?",
      es: "¿Zoharav extrae, compra o vende oro, esmeraldas u otros minerales?",
    },
    answer: {
      en: "No. We advise on development, investment, and responsible practice. We do not extract minerals, take title to them, or trade them.",
      es: "No. Asesoramos el desarrollo, la inversión y la práctica responsable. No extraemos minerales, no tomamos su titularidad ni los comercializamos.",
    },
  },
  {
    id: "mining-esg",
    category: "service",
    service: "mining-natural-resources",
    showOnHome: false,
    question: {
      en: "How do you treat communities and mine closure?",
      es: "¿Cómo tratan a las comunidades y el cierre de mina?",
    },
    answer: {
      en: "As part of the investment case, not as an appendix. Social license, closure cost, and traceability are reviewed before a structure is recommended.",
      es: "Como parte del caso de inversión, no como un anexo. La licencia social, el costo de cierre y la trazabilidad se revisan antes de recomendar una estructura.",
    },
  },
  {
    id: "mining-origin",
    category: "service",
    service: "mining-natural-resources",
    showOnHome: false,
    question: {
      en: "Can you advise on responsible origin for gold and emeralds?",
      es: "¿Pueden asesorar el origen responsable del oro y las esmeraldas?",
    },
    answer: {
      en: "Yes. We advise on supply-chain traceability and the standards buyers and financiers expect. We do not certify parcels and we do not intermediate the sale.",
      es: "Sí. Asesoramos la trazabilidad de la cadena y los estándares que compradores y financiadores esperan. No certificamos lotes ni intermediamos la venta.",
    },
  },
];

export const mining: Service = {
  slug: "mining-natural-resources",
  number: "03",
  name: { en: "Mining & Natural Resources", es: "Minería y recursos naturales" },
  cardLine: {
    en: "Gold, emeralds, and strategic minerals — advised, never traded.",
    es: "Oro, esmeraldas y minerales estratégicos: asesorados, nunca comercializados.",
  },
  heroTitle: { en: "Mining & Natural Resources", es: "Minería y recursos naturales" },
  heroIntro: {
    en: "Development and investment advisory for high-value mineral assets. Precious resources, strategic value, and a standard of care that includes the community and the land after the mine.",
    es: "Asesoría de desarrollo e inversión para activos minerales de alto valor. Recursos preciosos, valor estratégico y un estándar de cuidado que incluye a la comunidad y a la tierra después de la mina.",
  },
  image: "/images/services/mining.jpg",
  industries: ["mining", "financial", "public-sector"],
  faqs,
  methodologies: [
    {
      id: "assess-steward",
      name: { en: "Assess / Structure / Develop / Steward", es: "Evaluar / Estructurar / Desarrollar / Cuidar" },
      intro: {
        en: "Four phases for a mineral mandate that has to satisfy capital and the people who live with the asset.",
        es: "Cuatro fases para un mandato mineral que tiene que satisfacer al capital y a quienes conviven con el activo.",
      },
      phases: [
        {
          step: "01",
          title: { en: "Assess", es: "Evaluar" },
          body: {
            en: "Diligence on the asset, the title, the jurisdiction, and the environmental and social facts that will decide whether capital should proceed.",
            es: "Diligencia sobre el activo, el título, la jurisdicción y los hechos ambientales y sociales que decidirán si el capital debe seguir.",
          },
        },
        {
          step: "02",
          title: { en: "Structure", es: "Estructurar" },
          body: {
            en: "A partnership, a financing path, and a governance design that names who carries the operating risk. It is not us.",
            es: "Una alianza, una ruta de financiamiento y un diseño de gobierno que nombra quién carga el riesgo operativo. No somos nosotros.",
          },
        },
        {
          step: "03",
          title: { en: "Develop", es: "Desarrollar" },
          body: {
            en: "Advisory through the development decisions: sequencing, partners, and the conditions that should stop the project.",
            es: "Asesoría a lo largo de las decisiones de desarrollo: secuencia, socios y las condiciones que deberían detener el proyecto.",
          },
        },
        {
          step: "04",
          title: { en: "Steward", es: "Cuidar" },
          body: {
            en: "Ongoing counsel on responsible practice, community relations, traceability, and closure — so value is not borrowed from the future.",
            es: "Consejo continuo sobre práctica responsable, relación con comunidades, trazabilidad y cierre, para que el valor no se tome prestado del futuro.",
          },
        },
      ],
    },
  ],
  subServices: [
    {
      id: "diligence",
      title: { en: "Asset Diligence", es: "Diligencia del activo" },
      tagline: { en: "Know what you are being asked to believe.", es: "Saber qué le están pidiendo creer." },
      hover: {
        en: "Title, geology at the level a decision requires, jurisdiction, and the gap between a teaser and a bankable story.",
        es: "Título, geología al nivel que una decisión exige, jurisdicción y la distancia entre un teaser y una historia financiable.",
      },
      body: {
        en: "Before a partnership is flattered, the asset has to be read. We coordinate diligence on title, resource confidence, jurisdiction, fiscal terms, and the quality of the information a sponsor is relying on. We advise the investor or the owner. We do not take the concession.",
        es: "Antes de halagar una alianza, hay que leer el activo. Coordinamos la diligencia de título, confianza del recurso, jurisdicción, términos fiscales y la calidad de la información en la que se apoya un patrocinador. Asesoramos al inversionista o al propietario. No tomamos la concesión.",
      },
      bullets: [
        { en: "Title, tenure, and jurisdiction review", es: "Revisión de título, tenencia y jurisdicción" },
        { en: "Resource-confidence and study-stage reading", es: "Lectura de la confianza del recurso y de la etapa de estudio" },
        { en: "Fiscal terms and country-risk framing", es: "Términos fiscales y encuadre de riesgo país" },
        { en: "A written view of what is still unknown", es: "Una opinión escrita de lo que todavía se desconoce" },
      ],
      cta: { en: "Commission Asset Diligence", es: "Encargar la diligencia del activo" },
    },
    {
      id: "gold",
      title: { en: "Gold & Precious Metals", es: "Oro y metales preciosos" },
      tagline: { en: "Strategic value, responsible origin.", es: "Valor estratégico, origen responsable." },
      hover: {
        en: "Advisory for gold and precious-metal opportunities, from the investment case to the questions serious buyers ask about origin.",
        es: "Asesoría para oportunidades de oro y metales preciosos, del caso de inversión a las preguntas que los compradores serios hacen sobre el origen.",
      },
      body: {
        en: "Gold mandates require a cool head: price cyclicality, jurisdiction, and a supply chain that financiers and refiners will actually accept. We advise on the investment and on responsible origin. We do not buy, vault, or sell metal.",
        es: "Los mandatos de oro piden cabeza fría: ciclicidad del precio, jurisdicción y una cadena que financiadores y refinerías acepten de verdad. Asesoramos la inversión y el origen responsable. No compramos, custodiamos ni vendemos metal.",
      },
      bullets: [
        { en: "Investment case for precious-metal assets", es: "Caso de inversión de activos de metales preciosos" },
        { en: "Origin and chain-of-custody questions", es: "Preguntas de origen y cadena de custodia" },
        { en: "Partner and offtake logic, advised not intermediated", es: "Lógica de socios y offtake, asesorada y no intermediada" },
        { en: "Downside cases for price and jurisdiction", es: "Casos adversos de precio y jurisdicción" },
      ],
      cta: { en: "Discuss a Gold Mandate", es: "Conversar un mandato de oro" },
    },
    {
      id: "emeralds",
      title: { en: "Emeralds & Gemstones", es: "Esmeraldas y gemas" },
      tagline: { en: "Rarity is not a strategy by itself.", es: "La rareza no es, por sí sola, una estrategia." },
      hover: {
        en: "Emerald and gemstone opportunities judged on geology, origin, community context, and whether a global buyer can defend the stone.",
        es: "Oportunidades de esmeraldas y gemas juzgadas por la geología, el origen, el contexto comunitario y si un comprador global puede defender la piedra.",
      },
      body: {
        en: "Emeralds carry a particular Colombian and global story: high value, fragmented supply, and a buyer who will ask where the stone came from. We advise owners and investors on development choices, responsible origin, and market access. We do not cut, trade, or consign gems.",
        es: "Las esmeraldas cargan una historia particular, colombiana y global: alto valor, oferta fragmentada y un comprador que preguntará de dónde salió la piedra. Asesoramos a propietarios e inversionistas sobre decisiones de desarrollo, origen responsable y acceso a mercado. No tallamos, comercializamos ni consignamos gemas.",
      },
      bullets: [
        { en: "Development advisory for gemstone assets", es: "Asesoría de desarrollo de activos de gemas" },
        { en: "Origin, traceability, and buyer expectations", es: "Origen, trazabilidad y expectativas del comprador" },
        { en: "Community context around artisanal and formal supply", es: "Contexto comunitario de la oferta artesanal y formal" },
        { en: "Market-access strategy without becoming the merchant", es: "Estrategia de acceso a mercado sin volvernos el comerciante" },
      ],
      cta: { en: "Review an Emerald Opportunity", es: "Revisar una oportunidad de esmeraldas" },
    },
    {
      id: "development",
      title: { en: "Exploration & Development Advisory", es: "Asesoría en exploración y desarrollo" },
      tagline: { en: "From prospect to a decision a board can sign.", es: "Del prospecto a una decisión que un directorio pueda firmar." },
      hover: {
        en: "We advise on how an exploration or development story should be staged, funded, and governed. The client holds the license. We hold the pen.",
        es: "Asesoramos cómo debe escalonarse, financiarse y gobernarse una historia de exploración o desarrollo. El cliente tiene la licencia. Nosotros tenemos la pluma.",
      },
      body: {
        en: "Development advisory covers sequencing, study stages, partner selection, and the governance that keeps a project from outrunning its information. Exploration advice is strategic. It is not field operations.",
        es: "La asesoría de desarrollo cubre la secuencia, las etapas de estudio, la selección de socios y el gobierno que evita que un proyecto corra más que su información. El consejo de exploración es estratégico. No es operación de campo.",
      },
      bullets: [
        { en: "Stage-gate logic from prospect to development", es: "Lógica de compuertas del prospecto al desarrollo" },
        { en: "Study and budget discipline", es: "Disciplina de estudios y de presupuesto" },
        { en: "Partner fit for the next stage", es: "Encaje del socio para la etapa siguiente" },
        { en: "Explicit advice when the project should stop", es: "Un consejo explícito cuando el proyecto debería detenerse" },
      ],
      cta: { en: "Plan a Development Path", es: "Planear una ruta de desarrollo" },
    },
    {
      id: "sustainable-practice",
      title: { en: "Sustainable Mining Practices", es: "Prácticas mineras sostenibles" },
      tagline: { en: "The social and environmental case is the financial case.", es: "El caso social y ambiental es el caso financiero." },
      hover: {
        en: "Community relations, closure, water, and the right to operate — treated as conditions of capital, not as a brochure chapter.",
        es: "Relación con comunidades, cierre, agua y el derecho a operar, tratados como condiciones del capital y no como un capítulo de folleto.",
      },
      body: {
        en: "We advise on the environmental and social conditions of a mining investment: baseline expectations, community agreements, water and land, closure funding, and the standards lenders will ask to see. Responsible practice is part of diligence, not a later campaign.",
        es: "Asesoramos las condiciones ambientales y sociales de una inversión minera: expectativas de línea base, acuerdos con comunidades, agua y tierra, fondeo del cierre y los estándares que los prestamistas van a pedir. La práctica responsable es parte de la diligencia, no una campaña posterior.",
      },
      bullets: [
        { en: "Environmental and social baseline counsel", es: "Consejo sobre la línea base ambiental y social" },
        { en: "Community relations and social license", es: "Relación con comunidades y licencia social" },
        { en: "Mine-closure planning and funding logic", es: "Planeación del cierre y lógica de fondeo" },
        { en: "Alignment with the ESG standards the capital requires", es: "Alineación con los estándares ESG que el capital exige" },
      ],
      cta: { en: "Review Responsible Practice", es: "Revisar la práctica responsable" },
    },
    {
      id: "market-access",
      title: { en: "Market Access & Global Trade Advisory", es: "Asesoría de acceso a mercado y comercio global" },
      tagline: { en: "A route to market. Not a trading desk.", es: "Una ruta al mercado. No una mesa de trading." },
      hover: {
        en: "We advise on how a responsible mineral reaches a credible buyer: standards, counterparties, and the commercial structure. We do not intermediate the sale.",
        es: "Asesoramos cómo un mineral responsable llega a un comprador creíble: estándares, contrapartes y la estructura comercial. No intermediamos la venta.",
      },
      body: {
        en: "Market-access work helps owners and investors understand buyer requirements, traceability, and the commercial partnerships that make a mineral financeable and saleable by the client. Zoharav does not buy, broker, or ship the product.",
        es: "El trabajo de acceso a mercado ayuda a propietarios e inversionistas a entender los requisitos del comprador, la trazabilidad y las alianzas comerciales que hacen que el cliente pueda financiar y vender el mineral. Zoharav no compra, intermedia ni embarca el producto.",
      },
      bullets: [
        { en: "Buyer and refiner requirement mapping", es: "Mapa de requisitos de compradores y refinerías" },
        { en: "Traceability design for gold and gemstones", es: "Diseño de trazabilidad para oro y gemas" },
        { en: "Commercial-structure advice for the client’s own sale", es: "Consejo de estructura comercial para la venta del propio cliente" },
        { en: "A hard limit: we are not the merchant", es: "Un límite firme: no somos el comerciante" },
      ],
      cta: { en: "Advise on Market Access", es: "Asesorar el acceso a mercado" },
    },
  ],
};
