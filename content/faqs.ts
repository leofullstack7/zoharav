import type { FaqItem } from "./types";

/** Home and firm FAQs, edited. Technology, cybersecurity, and related certificates are removed. */
export const firmFaqs: FaqItem[] = [
  {
    id: "scope",
    category: "firm",
    showOnHome: true,
    question: {
      en: "What is the scope of Zoharav's strategic consulting services?",
      es: "¿Cuál es el alcance de la consultoría estratégica de Zoharav?",
    },
    answer: {
      en: "Zoharav advises large corporations and organizations with international operations. Our portfolio has six lines: Energy Transition & Decarbonization, Oil & Energy Advisory, Mining & Natural Resources, Sustainability & ESG, Investment & Financial Advisory, and Strategic & Operational Consulting. Each engagement follows a proven method and a mandate shaped to the organization, with results that are meant to be measured and sustained. We advise. We do not extract, sell, or transport natural resources.",
      es: "Zoharav asesora a grandes corporaciones y organizaciones con operaciones internacionales. El portafolio tiene seis líneas: Transición energética y descarbonización, Asesoría en petróleo y energía, Minería y recursos naturales, Sostenibilidad y ESG, Asesoría de inversión y finanzas, y Consultoría estratégica y operativa. Cada mandato sigue un método probado y se ajusta a la organización, con resultados que deben poder medirse y sostenerse. Asesoramos. No extraemos, vendemos ni transportamos recursos naturales.",
    },
  },
  {
    id: "reservation",
    category: "booking",
    showOnHome: true,
    question: {
      en: "How does the consulting reservation process work?",
      es: "¿Cómo funciona la reserva de la consultoría?",
    },
    answer: {
      en: "A reservation of USD $500, placed through our secure checkout, holds an initial strategic session with a senior advisor. The session includes a preliminary diagnostic, a definition of scope, and a written value proposition. The amount is credited toward the full engagement once the mandate is confirmed. The session lasts 60 minutes and may be held virtually or in person.",
      es: "Una reserva de USD $500, realizada en nuestra pasarela segura, asegura una sesión estratégica inicial con un asesor senior. La sesión incluye un diagnóstico preliminar, la definición del alcance y una propuesta de valor por escrito. El monto se acredita al encargo completo cuando el mandato se confirma. La sesión dura 60 minutos y puede ser virtual o presencial.",
    },
  },
  {
    id: "methodology",
    category: "method",
    showOnHome: true,
    question: {
      en: "What is Zoharav's working methodology with corporate clients?",
      es: "¿Cuál es la metodología de trabajo de Zoharav con clientes corporativos?",
    },
    answer: {
      en: "The work moves through four phases: (1) Diagnostic — a close reading of the current situation through interviews with decision-makers and a review of the operation; (2) Strategic design — a course of action aligned with the business; (3) Guided implementation — support while the initiatives are carried out; and (4) Continuous optimization — follow-up on the agreed indicators so the result holds. We work as an extension of the executive team.",
      es: "El trabajo avanza en cuatro fases: (1) Diagnóstico — una lectura cercana de la situación mediante entrevistas con quienes deciden y una revisión de la operación; (2) Diseño estratégico — un curso de acción alineado con el negocio; (3) Implementación acompañada — apoyo mientras las iniciativas se ejecutan; y (4) Optimización continua — seguimiento de los indicadores acordados para que el resultado se sostenga. Trabajamos como una extensión del equipo ejecutivo.",
    },
  },
  {
    id: "clients",
    category: "firm",
    showOnHome: true,
    question: {
      en: "What type of organizations comprise Zoharav's client portfolio?",
      es: "¿Qué tipo de organizaciones forman el portafolio de Zoharav?",
    },
    answer: {
      en: "Our work is focused on large corporations, multinational companies, industrial groups, and leading organizations in energy, mining and natural resources, manufacturing, infrastructure, and financial services. We sit with chief executives and boards that need a clearer strategy, a more resilient operation, and a responsible way to deploy capital.",
      es: "Nuestro trabajo se concentra en grandes corporaciones, compañías multinacionales, grupos industriales y organizaciones líderes en energía, minería y recursos naturales, manufactura, infraestructura y servicios financieros. Nos sentamos con la alta dirección y los directorios que necesitan una estrategia más clara, una operación más resiliente y una forma responsable de desplegar capital.",
    },
  },
  {
    id: "geographies",
    category: "geography",
    showOnHome: true,
    question: {
      en: "In which geographies does Zoharav operate?",
      es: "¿En qué geografías opera Zoharav?",
    },
    answer: {
      en: "Zoharav serves clients across the Americas, Europe, Asia-Pacific, and the Middle East. A multicultural team and a network of market specialists help us read the regulatory, cultural, and operating particularities of each region. Work is delivered in person or remotely, according to the mandate. Our principal desks are Medellín, Miami, and Puerto Rico.",
      es: "Zoharav atiende clientes en las Américas, Europa, Asia-Pacífico y Medio Oriente. Un equipo multicultural y una red de especialistas de mercado nos permiten leer las particularidades regulatorias, culturales y operativas de cada región. El trabajo se entrega de forma presencial o remota, según el mandato. Nuestras mesas principales están en Medellín, Miami y Puerto Rico.",
    },
  },
  {
    id: "reservation-vs-project",
    category: "booking",
    showOnHome: true,
    question: {
      en: "What is the difference between the initial reservation and the complete project?",
      es: "¿Cuál es la diferencia entre la reserva inicial y el proyecto completo?",
    },
    answer: {
      en: "The USD $500 reservation is a commitment that lets us dedicate senior time to understanding the situation. The session covers a preliminary reading, the opportunities that matter, measurable objectives, and a proposal for the full mandate. The reservation is deducted from the project fee if you proceed with the firm.",
      es: "La reserva de USD $500 es un compromiso que nos permite dedicar tiempo senior a comprender la situación. La sesión cubre una lectura preliminar, las oportunidades que importan, objetivos medibles y una propuesta para el mandato completo. La reserva se descuenta de los honorarios del proyecto si decide continuar con la firma.",
    },
  },
  {
    id: "guarantees",
    category: "firm",
    showOnHome: true,
    question: {
      en: "What guarantees does Zoharav offer regarding consulting results?",
      es: "¿Qué garantías ofrece Zoharav sobre los resultados de la consultoría?",
    },
    answer: {
      en: "We do not stop at a recommendation. Each mandate is structured around clear indicators and a service understanding that sets expectations in writing. Guided implementation is there so that strategy becomes an operating result. We keep the process transparent and remain available after implementation so the improvement can hold.",
      es: "No nos detenemos en una recomendación. Cada mandato se estructura con indicadores claros y un entendimiento de servicio que deja las expectativas por escrito. La implementación acompañada existe para que la estrategia se vuelva un resultado operativo. Mantenemos el proceso transparente y seguimos disponibles después de la implementación para que la mejora se sostenga.",
    },
  },
  {
    id: "confidentiality",
    category: "confidentiality",
    showOnHome: true,
    question: {
      en: "How does Zoharav protect corporate information confidentiality?",
      es: "¿Cómo protege Zoharav la confidencialidad de la información corporativa?",
    },
    answer: {
      en: "Confidentiality is a condition of the work, not an add-on. Consultants are bound by non-disclosure agreements. Client materials are handled under the privacy commitments described in our Privacy Policy, including GDPR and CCPA where they apply. We do not sell personal information.",
      es: "La confidencialidad es una condición del trabajo, no un complemento. Los consultores están sujetos a acuerdos de no divulgación. Los materiales del cliente se tratan conforme a los compromisos descritos en nuestra Política de privacidad, incluidos el GDPR y el CCPA cuando aplican. No vendemos información personal.",
    },
  },
  {
    id: "duration",
    category: "method",
    showOnHome: true,
    question: {
      en: "How long does a typical consulting project with Zoharav take?",
      es: "¿Cuánto dura un proyecto típico de consultoría con Zoharav?",
    },
    answer: {
      en: "Duration follows the complexity and the objective. A focused strategic mandate can be completed in 8–12 weeks. Broader organizational transformations may run from 6 to 18 months. In the session that follows the reservation, we set a timeline with milestones and deliverables aligned to the business.",
      es: "La duración sigue la complejidad y el objetivo. Un mandato estratégico acotado puede completarse en 8 a 12 semanas. Las transformaciones organizacionales más amplias pueden extenderse de 6 a 18 meses. En la sesión que sigue a la reserva definimos un cronograma con hitos y entregables alineados al negocio.",
    },
  },
  {
    id: "credentials",
    category: "firm",
    showOnHome: true,
    question: {
      en: "What credentials and experience back Zoharav's team?",
      es: "¿Qué credenciales y experiencia respaldan al equipo de Zoharav?",
    },
    answer: {
      en: "The team brings senior consultants with an average of over 15 years of experience in leading global firms, former Fortune 500 executives, and specialists holding certifications such as PMP and CFA, among others. Sector judgment and strategic discipline sit in the same room.",
      es: "El equipo reúne consultores senior con un promedio de más de 15 años de experiencia en firmas globales de primer nivel, exejecutivos de compañías Fortune 500 y especialistas con certificaciones como PMP y CFA, entre otras. El criterio de sector y la disciplina estratégica están en la misma mesa.",
    },
  },
];

export const energyFaqs: FaqItem[] = [
  {
    id: "energy-industries",
    category: "energy",
    service: "energy-transition",
    showOnHome: true,
    question: {
      en: "What industries can benefit from your energy transition advisory?",
      es: "¿Qué industrias pueden beneficiarse de la asesoría en transición energética?",
    },
    answer: {
      en: "We work with oil and gas companies, power generators, manufacturers, and logistics firms that are integrating more responsible energy practices. The work is advisory. We do not operate assets or trade energy products.",
      es: "Trabajamos con compañías de petróleo y gas, generadores de energía, fabricantes y empresas de logística que están integrando prácticas energéticas más responsables. El trabajo es de asesoría. No operamos activos ni comercializamos productos energéticos.",
    },
  },
  {
    id: "energy-modeling",
    category: "energy",
    service: "energy-transition",
    showOnHome: true,
    question: {
      en: "Do you offer financial modeling for renewable projects?",
      es: "¿Ofrecen modelación financiera para proyectos renovables?",
    },
    answer: {
      en: "Yes. We prepare capital structures, return projections, and risk assessments for clean-energy investments, so sponsors and lenders can judge a project before capital is committed.",
      es: "Sí. Preparamos estructuras de capital, proyecciones de retorno y evaluaciones de riesgo para inversiones en energía limpia, de modo que patrocinadores y prestamistas puedan juzgar un proyecto antes de comprometer capital.",
    },
  },
  {
    id: "energy-esg",
    category: "energy",
    service: "energy-transition",
    showOnHome: true,
    question: {
      en: "Can Zoharav support compliance with international ESG standards?",
      es: "¿Puede Zoharav acompañar el cumplimiento de estándares ESG internacionales?",
    },
    answer: {
      en: "Yes. We align strategies with recognized benchmarks, including the UN Sustainable Development Goals and the EU taxonomy, and with reporting frameworks such as GRI, SASB, TCFD/ISSB, and CSRD where they apply to the mandate.",
      es: "Sí. Alineamos las estrategias con referentes reconocidos, incluidos los Objetivos de Desarrollo Sostenible de la ONU y la taxonomía de la UE, y con marcos de reporte como GRI, SASB, TCFD/ISSB y CSRD cuando aplican al mandato.",
    },
  },
  {
    id: "energy-balance",
    category: "energy",
    service: "energy-transition",
    showOnHome: true,
    question: {
      en: "How do you balance operational efficiency with sustainability goals?",
      es: "¿Cómo equilibran la eficiencia operativa con las metas de sostenibilidad?",
    },
    answer: {
      en: "Our frameworks are built so that environmental improvement does not ignore cost, reliability, or production performance. Efficiency and emissions reduction are treated as one management problem, not two competing slogans.",
      es: "Nuestros marcos están pensados para que la mejora ambiental no ignore el costo, la confiabilidad ni el desempeño productivo. La eficiencia y la reducción de emisiones se tratan como un solo problema de gestión, no como dos consignas en competencia.",
    },
  },
];

export const faqs: FaqItem[] = [...firmFaqs, ...energyFaqs];
export const homeFaqs = faqs.filter((item) => item.showOnHome);
