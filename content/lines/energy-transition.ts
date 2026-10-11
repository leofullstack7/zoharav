import { energyFaqs } from "../faqs";
import type { Service } from "../types";

export const energyTransition: Service = {
  slug: "energy-transition",
  number: "01",
  name: {
    en: "Energy Transition & Decarbonization",
    es: "Transición energética y descarbonización",
  },
  cardLine: {
    en: "A practical path from today's assets to a credible net-zero plan.",
    es: "Un camino práctico desde los activos de hoy hasta un plan creíble de cero neto.",
  },
  heroTitle: {
    en: "Energy Transition Advisory",
    es: "Asesoría en transición energética",
  },
  heroIntro: {
    en: "Navigating the path to net-zero through strategic decarbonization, renewable integration, and a disciplined energy transformation. We advise. We do not operate energy assets or trade energy products.",
    es: "Acompañamos el camino hacia el cero neto mediante descarbonización estratégica, integración de renovables y una transformación energética disciplinada. Asesoramos. No operamos activos ni comercializamos productos energéticos.",
  },
  image: "/images/services/energy-transition.jpg",
  industries: ["energy-utilities", "oil-gas", "manufacturing", "logistics"],
  slides: [],
  methodologies: [
    {
      id: "assess-optimize",
      name: { en: "Assess / Strategize / Execute / Optimize", es: "Evaluar / Estrategia / Ejecutar / Optimizar" },
      intro: {
        en: "A proven framework for navigating the path to net-zero.",
        es: "Un marco probado para recorrer el camino hacia el cero neto.",
      },
      phases: [
        {
          step: "01",
          title: { en: "Assess", es: "Evaluar" },
          body: {
            en: "A carbon-footprint reading, an emissions map, and a clear view of where the highest-impact reductions sit, so the baseline is honest before any roadmap is drawn.",
            es: "Una lectura de la huella de carbono, un mapa de emisiones y una vista clara de dónde están las reducciones de mayor impacto, para que la línea base sea honesta antes de trazar cualquier hoja de ruta.",
          },
        },
        {
          step: "02",
          title: { en: "Strategize", es: "Estrategia" },
          body: {
            en: "A net-zero roadmap with technology choices judged on merit, a financial model, and a phased plan the organization can actually fund.",
            es: "Una hoja de ruta de cero neto con opciones tecnológicas juzgadas por su mérito, un modelo financiero y un plan por fases que la organización pueda financiar de verdad.",
          },
        },
        {
          step: "03",
          title: { en: "Execute", es: "Ejecutar" },
          body: {
            en: "Support through partner selection, the business case, and a governance frame so the program does not live only in a slide.",
            es: "Acompañamiento en la selección de socios, el caso de negocio y un marco de gobierno para que el programa no viva solo en una lámina.",
          },
        },
        {
          step: "04",
          title: { en: "Optimize", es: "Optimizar" },
          body: {
            en: "Performance follow-up and refinement as regulation, capital markets, and the asset base move.",
            es: "Seguimiento del desempeño y ajuste a medida que se mueven la regulación, los mercados de capital y la base de activos.",
          },
        },
      ],
    },
  ],
  faqs: energyFaqs,
  subServices: [
    {
      id: "decarbonization-esg",
      title: { en: "Decarbonization & ESG Strategy", es: "Estrategia de descarbonización y ESG" },
      tagline: { en: "A credible path to net-zero.", es: "Un camino creíble hacia el cero neto." },
      hover: {
        en: "We map emissions across the value chain, set a baseline, and design a net-zero roadmap that protects returns while opening the door to green financing.",
        es: "Mapeamos las emisiones a lo largo de la cadena, fijamos una línea base y diseñamos una hoja de ruta de cero neto que protege el retorno y abre la puerta al financiamiento verde.",
      },
      body: {
        en: "Decarbonization is a strategic and financial discipline. We help organizations establish an emissions baseline across Scope 1, 2, and 3, choose the abatement that belongs in this decade, and build a roadmap that investors, lenders, and boards can read. Reporting is aligned to the frameworks the mandate actually requires.",
        es: "La descarbonización es una disciplina estratégica y financiera. Ayudamos a establecer una línea base de emisiones en los alcances 1, 2 y 3, a elegir la reducción que corresponde a esta década y a construir una hoja de ruta que inversionistas, prestamistas y directorios puedan leer. El reporte se alinea a los marcos que el mandato realmente exige.",
      },
      bullets: [
        { en: "Emissions baseline across Scope 1, 2, and 3", es: "Línea base de emisiones en alcances 1, 2 y 3" },
        { en: "Net-zero roadmap with phased abatement", es: "Hoja de ruta de cero neto con reducción por fases" },
        { en: "Green-financing readiness and the investor narrative", es: "Preparación para financiamiento verde y narrativa para inversionistas" },
        { en: "ESG reporting aligned with GRI, SASB, TCFD/ISSB, and CSRD", es: "Reporte ESG alineado con GRI, SASB, TCFD/ISSB y CSRD" },
      ],
      cta: { en: "Schedule a Decarbonization Session", es: "Agendar una sesión de descarbonización" },
    },
    {
      id: "oil-gas-transformation",
      title: { en: "Oil & Gas Transformation Advisory", es: "Asesoría de transformación en petróleo y gas" },
      tagline: { en: "Modernize the mandate. Do not confuse it with operations.", es: "Modernizar el mandato. No confundirlo con la operación." },
      hover: {
        en: "We advise across the value chain on cost, operating model, and a transition that still has to earn its return. We do not produce, refine, or move the barrel.",
        es: "Asesoramos a lo largo de la cadena sobre costo, modelo operativo y una transición que igual tiene que ganarse su retorno. No producimos, refinamos ni movemos el barril.",
      },
      body: {
        en: "Oil and gas companies are under pressure to improve efficiency, reduce cost, and live with price volatility. Our transformation advisory helps them redesign legacy operations through process work and organizational design. Engagements on the previous site referred to cost reductions in the range of 20–35%; that figure remains subject to validation and is never a guarantee. The counsel is strategic. Zoharav does not explore, extract, refine, or transport hydrocarbons.",
        es: "Las compañías de petróleo y gas están bajo presión para mejorar la eficiencia, reducir el costo y convivir con la volatilidad del precio. Nuestra asesoría de transformación les ayuda a rediseñar operaciones heredadas mediante el trabajo de procesos y el diseño organizacional. En el sitio anterior se hablaba de reducciones de costo del orden del 20–35 %; esa cifra sigue sujeta a validación y nunca es una garantía. El consejo es estratégico. Zoharav no explora, extrae, refina ni transporta hidrocarburos.",
      },
      bullets: [
        { en: "Operating-model advisory across exploration, production, and distribution", es: "Asesoría de modelo operativo en exploración, producción y distribución" },
        { en: "Process optimization to remove waste and protect margins", es: "Optimización de procesos para eliminar desperdicio y proteger márgenes" },
        { en: "Organizational design for clearer, faster decisions", es: "Diseño organizacional para decisiones más claras y rápidas" },
        { en: "Asset-portfolio and capital-allocation counsel", es: "Consejo sobre portafolio de activos y asignación de capital" },
      ],
      cta: { en: "Schedule Transformation Advisory", es: "Agendar asesoría de transformación" },
    },
    {
      id: "renewable-integration",
      title: { en: "Renewable Integration & Hybrid Systems", es: "Integración de renovables y sistemas híbridos" },
      tagline: { en: "Diversify the portfolio without losing the core.", es: "Diversificar el portafolio sin perder el núcleo." },
      hover: {
        en: "From feasibility to the investment case, we help you judge technologies, structure capital, and plan how renewable assets sit beside what you already run.",
        es: "De la factibilidad al caso de inversión, le ayudamos a juzgar tecnologías, estructurar capital y planear cómo se sientan los activos renovables junto a lo que ya opera.",
      },
      body: {
        en: "Renewable integration is both an expectation and a way to diversify revenue, temper commodity exposure, and open markets that conventional assets alone will not reach. We advise on hybrid systems that lower carbon intensity while reliability and return remain in the room.",
        es: "La integración de renovables es a la vez una expectativa y una forma de diversificar ingresos, moderar la exposición a commodities y abrir mercados que los activos convencionales solos no alcanzan. Asesoramos sistemas híbridos que bajan la intensidad de carbono sin sacar de la mesa la confiabilidad ni el retorno.",
      },
      bullets: [
        { en: "Hybrid-system design that respects existing assets", es: "Diseño de sistemas híbridos que respeta los activos existentes" },
        { en: "Technology judgment across solar, wind, hydrogen, and storage", es: "Juicio tecnológico entre solar, eólica, hidrógeno y almacenamiento" },
        { en: "Investment structure and partnership strategy", es: "Estructura de inversión y estrategia de alianzas" },
        { en: "Grid and multi-source integration planning", es: "Planeación de integración a red y de múltiples fuentes" },
      ],
      cta: { en: "Explore Integration Strategy", es: "Explorar la estrategia de integración" },
    },
    {
      id: "ccs",
      title: { en: "Carbon Capture & Storage", es: "Captura y almacenamiento de carbono" },
      tagline: { en: "A serious option inside a net-zero plan.", es: "Una opción seria dentro de un plan de cero neto." },
      hover: {
        en: "We advise across the CCS chain: capture options, transport corridors, storage geology, and the commercial model, including hubs and carbon-market participation.",
        es: "Asesoramos a lo largo de la cadena de CCS: opciones de captura, corredores de transporte, geología de almacenamiento y el modelo comercial, incluidos hubs y la participación en mercados de carbono.",
      },
      body: {
        en: "Carbon capture is one of the few paths that lets hydrocarbon producers pursue net-zero without pretending the asset does not exist. We help clients judge feasibility, cost, regulation, and the way credits or policy incentives might change the return. Advisory only: we do not build, operate, or transport CO₂.",
        es: "La captura de carbono es uno de los pocos caminos que permite a los productores de hidrocarburos buscar el cero neto sin fingir que el activo no existe. Ayudamos a juzgar factibilidad, costo, regulación y la forma en que los créditos o los incentivos pueden cambiar el retorno. Solo asesoría: no construimos, operamos ni transportamos CO₂.",
      },
      bullets: [
        { en: "Feasibility, cost, and economic framing", es: "Factibilidad, costo y encuadre económico" },
        { en: "Technology judgment across capture routes, including direct air capture", es: "Juicio tecnológico entre rutas de captura, incluida la captura directa de aire" },
        { en: "Storage-site evaluation and long-term monitoring logic", es: "Evaluación de sitios de almacenamiento y lógica de monitoreo de largo plazo" },
        { en: "Carbon-credit strategy in voluntary and compliance markets", es: "Estrategia de créditos de carbono en mercados voluntarios y regulados" },
      ],
      cta: { en: "Request a CCS Strategy Session", es: "Solicitar una sesión de estrategia CCS" },
    },
    {
      id: "energy-efficiency",
      title: { en: "Energy Efficiency & Emissions Reduction", es: "Eficiencia energética y reducción de emisiones" },
      tagline: { en: "The fastest cut in cost and carbon.", es: "El recorte más rápido de costo y de carbono." },
      hover: {
        en: "We identify where energy is wasted and which measures pay for themselves, from the field to the plant to the network. No software product. No sensor program sold as a service.",
        es: "Identificamos dónde se desperdicia energía y qué medidas se pagan solas, del campo a la planta y a la red. Ningún producto de software. Ningún programa de sensores vendido como servicio.",
      },
      body: {
        en: "Efficiency is still the most direct way to lower both operating cost and emissions. We advise energy and industrial companies on baselines, opportunity sets, and the capital ranking of measures across upstream, midstream, and downstream activity. The work is managerial and financial. It is not a technology implementation.",
        es: "La eficiencia sigue siendo la vía más directa para bajar a la vez el costo operativo y las emisiones. Asesoramos a compañías de energía e industria sobre líneas base, conjuntos de oportunidades y el orden de capital de las medidas en actividad upstream, midstream y downstream. El trabajo es de gestión y de finanzas. No es una implementación tecnológica.",
      },
      bullets: [
        { en: "Energy baseline and emissions-intensity reading", es: "Línea base de energía y lectura de intensidad de emisiones" },
        { en: "Opportunity identification across the operation", es: "Identificación de oportunidades en toda la operación" },
        { en: "Capital ranking of high-return efficiency measures", es: "Priorización de capital de las medidas de eficiencia con mejor retorno" },
        { en: "A performance frame that keeps the reduction in place", es: "Un marco de desempeño que mantiene la reducción en el tiempo" },
      ],
      cta: { en: "Request an Efficiency Review", es: "Solicitar una revisión de eficiencia" },
    },
  ],
};
