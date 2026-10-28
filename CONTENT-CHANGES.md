# Cambios de contenido frente al sitio anterior

Fuente: extracción de zoharav.com del 1 de octubre de 2026 (62 páginas).
El sitio nuevo asesora. No opera, no extrae, no vende y no transporta petróleo, gas ni minerales.

## Qué se eliminó

| Origen | Qué salió | Motivo |
| --- | --- | --- |
| Página completa `/pages/data-ai` | Data & AI, ML, RAG, casos, “Experience AI in Motion”, cifras de IA | La firma deja de prestar servicios de tecnología |
| Página completa `/pages/cybersecurity` | Zero Trust, SOC, OT/ICS, ISO 27001 / SOC 2 / PCI como servicio, “847K threats” | Igual |
| Home “Our Digital Power” | Digital Transformation, AI, Smart Infrastructure, Cybersecurity | Igual |
| Home, tarjetas | Automation & Artificial Intelligence, Cybersecurity | Igual |
| Home, Core Expertise | “Energy Efficiency & AI”, “Digital Optimization” | Reemplazadas por eficiencia y reducción de emisiones, sin tecnología |
| Strategic Consulting | Technology & Innovation, Cybersecurity & Risk Governance, Digital Ecosystems & IoT | Igual |
| Operational Efficiency | Digital Transformation & Automation, Industry 4.0, RPA, IoT, digital twin, AI/ML | Igual |
| Booking | Categorías Data & AI y Cybersecurity, y los subservicios tecnológicos de estrategia y operaciones | Igual |
| Chatbot “Octano” | Asistente de IA | Será un Private Concierge humano (fase de layout) |
| Help Center `/pages/help` | 404 y “Continue shopping” | Las preguntas viven en `/faq` |
| UI de tienda | “Introducing our latest products…”, “Inicio · Tienda · Contacto · Carrito”, “Add to cart” | No es un ecommerce |
| Redes | Enlaces `#` | Solo se muestran si hay URL en `content/site.ts` |
| Teléfonos de mockup | 555-0123 | Ficticios. Los campos quedan vacíos y se ocultan |
| Misión anterior | Cybersecurity, software, real estate, legal assistance, solar como línea de producto | Misión reescrita |
| FAQ | Data & AI, Cybersecurity, CISA, CISSP, AWS Certified, ISO 27001 como sello | Credenciales que quedan: PMP, CFA, “among others” |
| Cifras de ciberseguridad e IA | 847K, 99.9%, $500M+, 40%, 3x, 90%, 85%, 150+ proyectos de IA | No se conservan |

## Qué se reescribió

| Pieza | Cambio |
| --- | --- |
| Decarbonization & ESG | El PDF repetía el texto de Oil & Gas. Ahora tiene línea base Scope 1-2-3, hoja de ruta net-zero, financiamiento verde y marcos GRI, SASB, TCFD/ISSB, CSRD |
| Energy Efficiency | Sin AI, IoT, sensores ni Industry 4.0. Foco en eficiencia y reducción de emisiones |
| Oil & Gas / Oil & Energy | Siempre “advisory”. Se conserva la mención 20–35% como cifra heredada, sujeta a validación, nunca como garantía |
| Misión y visión | Recursos naturales, energía, sostenibilidad e inversión responsable |
| Financial Advisory | Financiamiento verde, project finance, capital, valoración, due diligence, riesgo de commodities. Sin placeholders ni “Descripción:” |
| Restructuring & Turnaround | Texto nuevo. El PDF solo tenía “First key point” |
| Slider “Trusted advisors…” | Se eliminó el texto de tienda. El reemplazo habla de decisión cuando el mercado no se queda quieto |
| Operational Efficiency | Pasa a “Operational Consulting — optimization and risk management”, dentro de Strategic & Operational Consulting |
| Terms | Se mantiene la ley de Colombia. “Trade and market intelligence (including oil benchmark analysis)” pasa a “Market intelligence advisory” |
| Refund | El PDF decía que el sitio no procesa pagos. Hay una cláusula nueva para la reserva de USD $500. Marcada para revisión legal |
| Damage | Se quitó el lenguaje de “producto digital” y de tienda. Marcado para revisión legal |
| Confidencialidad (FAQ) | GDPR y CCPA se mantienen. Se retira ISO 27001 como afirmación |
| Privacidad, sellos | ISO 27001 Certified, SOC 2 y PCI DSS no se publican como hechos |
| “Communication is key” | Corregido. El PDF decía “Comunnication” |
| Inteligence / Cibersecurity | Corregidos donde el texto se conserva |

## Qué es nuevo

| Pieza | Dónde vive |
| --- | --- |
| Mining & Natural Resources | `content/lines/mining.ts` y capítulo 04 del home |
| Seis líneas de servicio y cuatro pilares del home | `content/services.ts`, `content/navigation.ts` |
| Oficina Medellín como hub | `content/offices.ts` (dirección TODO) |
| Dubai | Sigue en el archivo con `active: false` |
| Reserva por las seis líneas, sin tecnología | `content/booking.ts` |
| Tres artículos semilla | Fase 8. Carpeta `content/insights/` reservada |
| Declaración corta del footer | `compliance.footerLine` en `content/site.ts` |

## Declaración de cumplimiento

El texto en inglés de `content/site.ts` (`compliance.paragraphs`) es el del PDF, literal.
El español es traducción de trabajo. La versión que manda, hasta que legal diga otra cosa, es la inglesa.

## VERIFY — no ampliar estas cifras

Todas están en `content/stats.ts` con `verify: true`.

| Cifra | Tipo | Nota |
| --- | --- | --- |
| 500+ Projects | Afirmación de la firma | Home anterior |
| 3 Continents | Afirmación de la firma | Con Dubái inactivo, las oficinas activas están en las Américas. Confirmar antes de publicar |
| 24/7 Support | Afirmación de la firma | |
| 98% Efficiency | Afirmación de la firma | `placement: "hold"`. No entra en el interludio nuevo hasta validarse |
| 35+ Support Locations, 5 Continents, 15+ Languages | Afirmación de la firma | About / red de apoyo |
| 2050, 130+ países, 5.000 GW, $4T+, 80% | Contexto de mercado, no un KPI de Zoharav | Venían del PDF. Citar fuente antes de publicarlos como dato propio |
| 20–35% de reducción de costos | Cifra heredada de Oil & Gas | Aparece como referencia histórica, no como promesa |
| 15–30% de ahorro “con AI/IoT” | Eliminada | Iba atada a tecnología |

No se añadieron clientes, certificaciones ni teléfonos.

## TODO para el cliente

1. Dirección y horario de Medellín.
2. Confirmar si Dubái se publica (`active: false` hoy).
3. Teléfono principal y WhatsApp. Vacío = oculto.
4. URLs reales de redes. Vacío = icono oculto.
5. Revisar cargos del equipo, en especial “Chief Technology & Systems Officer”. Biografías y LinkedIn están vacíos a propósito.
6. Validar cada cifra de `content/stats.ts`.
7. Revisión legal de reembolsos (reserva de USD $500) y de la política de daños.
8. Confirmar si alguna certificación (ISO, SOC, PCI) puede decirse. Hoy no se afirma.
9. Fotografías y video del hero: ver `ASSETS.md`.
10. Aprobar o reescribir la misión y los tres artículos de Insights cuando existan.

## Rutas nuevas (mapa del PDF)

| PDF | Destino |
| --- | --- |
| Home (hero, compliance, support, offices, FAQ editada) | `/` |
| Our Company | `/about` |
| Energy Transition | `/services/energy-transition` |
| Oil & Gas Transformation + pilares de mercado | `/services/oil-and-energy` |
| Mining (no existía) | `/services/mining-natural-resources` |
| Decarbonization, CCS, renovables, net-zero, circular, climate risk | `/services/sustainability-esg` |
| Financial Advisory | `/services/investment-financial-advisory` |
| Strategic Consulting + Operational Efficiency, sin tecnología | `/services/strategic-operational-consulting` |
| Industrias, lista reducida | `/sectors` |
| Oficinas y geografías del FAQ | `/global-presence` |
| FAQ | `/faq` y bloque del home |
| Consulting Advisory + producto de USD $500 (captura de lead, sin pago en línea) | `/booking` |
| Contact | `/contact` |
| Privacy, Terms, Refund, Damage | `/legal/privacy`, `/legal/terms`, `/legal/refund`, `/legal/damage` |
| Data & AI, Cybersecurity, Help | Sin página. Redirección 301 a `/services` o `/faq` |
