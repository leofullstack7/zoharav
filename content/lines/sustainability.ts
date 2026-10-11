import type { FaqItem, Service } from "../types";

const faqs: FaqItem[] = [
  {
    id: "esg-frameworks",
    category: "service",
    service: "sustainability-esg",
    showOnHome: false,
    question: {
      en: "Which reporting frameworks do you work with?",
      es: "¿Con qué marcos de reporte trabajan?",
    },
    answer: {
      en: "We align mandates to the frameworks they actually face: GRI, SASB, TCFD/ISSB, and CSRD, and to reference points such as the UN Sustainable Development Goals and the EU taxonomy. We do not sell a software platform to file the report.",
      es: "Alineamos los mandatos a los marcos que de verdad enfrentan: GRI, SASB, TCFD/ISSB y CSRD, y a referentes como los Objetivos de Desarrollo Sostenible de la ONU y la taxonomía de la UE. No vendemos una plataforma de software para radicar el reporte.",
    },
  },
  {
    id: "esg-operators",
    category: "service",
    service: "sustainability-esg",
    showOnHome: false,
    question: {
      en: "Do you operate environmental projects or carbon assets?",
      es: "¿Operan proyectos ambientales o activos de carbono?",
    },
    answer: {
      en: "No. We advise on strategy, disclosure, climate risk, and the commercial logic of lower-carbon options. Clients remain responsible for their assets and their filings.",
      es: "No. Asesoramos la estrategia, la divulgación, el riesgo climático y la lógica comercial de las opciones de menor carbono. Los clientes siguen siendo responsables de sus activos y de sus reportes.",
    },
  },
  {
    id: "esg-community",
    category: "service",
    service: "sustainability-esg",
    showOnHome: false,
    question: {
      en: "Is community impact part of the ESG work?",
      es: "¿El impacto en la comunidad forma parte del trabajo ESG?",
    },
    answer: {
      en: "Yes. Social license, community development, and ethical practice sit beside emissions and disclosure. A number without a community is not a strategy.",
      es: "Sí. La licencia social, el desarrollo de la comunidad y la práctica ética se sientan junto a las emisiones y la divulgación. Un número sin comunidad no es una estrategia.",
    },
  },
];

export const sustainability: Service = {
  slug: "sustainability-esg",
  number: "04",
  name: { en: "Sustainability & ESG", es: "Sostenibilidad y ESG" },
  cardLine: {
    en: "Stewardship, disclosure, and value that can outlast a cycle.",
    es: "Cuidado, divulgación y un valor que puede durar más que un ciclo.",
  },
  heroTitle: { en: "Sustainability & ESG", es: "Sostenibilidad y ESG" },
  heroIntro: {
    en: "Responsible development for future generations. We advise on decarbonization, disclosure, climate risk, circular models, and the social conditions of a resource project.",
    es: "Desarrollo responsable para las próximas generaciones. Asesoramos descarbonización, divulgación, riesgo climático, modelos circulares y las condiciones sociales de un proyecto de recursos.",
  },
  image: "/images/services/sustainability.jpg",
  industries: ["energy-utilities", "oil-gas", "mining", "manufacturing", "agriculture", "public-sector"],
  faqs,
  methodologies: [
    {
      id: "assess-optimize",
      name: { en: "Assess / Strategize / Execute / Optimize", es: "Evaluar / Estrategia / Ejecutar / Optimizar" },
      intro: {
        en: "The energy-transition method, applied to the wider sustainability mandate.",
        es: "El método de transición energética, aplicado al mandato más amplio de sostenibilidad.",
      },
      phases: [
        {
          step: "01",
          title: { en: "Assess", es: "Evaluar" },
          body: {
            en: "Emissions, exposure, disclosure gaps, and the community facts that a serious ESG position has to include.",
            es: "Emisiones, exposición, vacíos de divulgación y los hechos comunitarios que una posición ESG seria tiene que incluir.",
          },
        },
        {
          step: "02",
          title: { en: "Strategize", es: "Estrategia" },
          body: {
            en: "A roadmap, a reporting choice, and the financing implications, written for a board rather than for a campaign.",
            es: "Una hoja de ruta, una elección de reporte y las implicaciones de financiamiento, escritas para un directorio y no para una campaña.",
          },
        },
        {
          step: "03",
          title: { en: "Execute", es: "Ejecutar" },
          body: {
            en: "Support while policies, partnerships, and the first disclosures are put in place.",
            es: "Acompañamiento mientras se ponen en marcha las políticas, las alianzas y las primeras divulgaciones.",
          },
        },
        {
          step: "04",
          title: { en: "Optimize", es: "Optimizar" },
          body: {
            en: "The position is revisited as standards, capital, and the asset base change.",
            es: "La posición se revisa a medida que cambian los estándares, el capital y la base de activos.",
          },
        },
      ],
    },
  ],
  subServices: [
    {
      id: "esg-strategy",
      title: { en: "Decarbonization & ESG Strategy", es: "Estrategia de descarbonización y ESG" },
      tagline: { en: "A position a stakeholder can audit.", es: "Una posición que un grupo de interés pueda auditar." },
      hover: {
        en: "Baseline, ambition, and the sequence of action — tied to financing and to the frameworks the company will have to face.",
        es: "Línea base, ambición y la secuencia de acción, atadas al financiamiento y a los marcos que la compañía va a tener que enfrentar.",
      },
      body: {
        en: "We build ESG strategies that start with an emissions baseline across Scope 1, 2, and 3 and end with a net-zero roadmap a financier can underwrite. Disclosure follows GRI, SASB, TCFD/ISSB, or CSRD according to the mandate, not according to fashion.",
        es: "Construimos estrategias ESG que empiezan con una línea base de emisiones en los alcances 1, 2 y 3 y terminan en una hoja de ruta de cero neto que un financiador pueda suscribir. La divulgación sigue GRI, SASB, TCFD/ISSB o CSRD según el mandato, no según la moda.",
      },
      bullets: [
        { en: "Scope 1, 2, and 3 baseline", es: "Línea base de alcances 1, 2 y 3" },
        { en: "Materiality that survives a question", es: "Una materialidad que sobrevive a una pregunta" },
        { en: "Green-financing narrative", es: "Narrativa de financiamiento verde" },
        { en: "Framework selection: GRI, SASB, TCFD/ISSB, CSRD", es: "Selección de marco: GRI, SASB, TCFD/ISSB, CSRD" },
      ],
      cta: { en: "Start an ESG Strategy", es: "Iniciar una estrategia ESG" },
    },
    {
      id: "net-zero",
      title: { en: "Net-Zero Strategy", es: "Estrategia de cero neto" },
      tagline: { en: "A year is not a plan.", es: "Un año no es un plan." },
      hover: {
        en: "We turn a net-zero pledge into a sequence of decisions: what is reduced, what is substituted, and what is still unresolved.",
        es: "Convertimos un compromiso de cero neto en una secuencia de decisiones: qué se reduce, qué se sustituye y qué sigue sin resolverse.",
      },
      body: {
        en: "A net-zero claim without a path is a liability. We help leadership define the path, the capital it requires, and the language that should not be used until the evidence exists.",
        es: "Una afirmación de cero neto sin camino es un pasivo. Ayudamos a la dirección a definir el camino, el capital que exige y el lenguaje que no debería usarse hasta que exista la evidencia.",
      },
      bullets: [
        { en: "Ambition tested against the asset base", es: "Ambición probada contra la base de activos" },
        { en: "A phased roadmap with owners", es: "Una hoja de ruta por fases, con responsables" },
        { en: "Capital and policy dependencies made explicit", es: "Dependencias de capital y de política, dichas de forma explícita" },
        { en: "Language disciplined enough for a regulator", es: "Un lenguaje lo bastante disciplinado para un regulador" },
      ],
      cta: { en: "Build a Net-Zero Roadmap", es: "Construir una hoja de ruta de cero neto" },
    },
    {
      id: "renewables",
      title: { en: "Renewable Integration", es: "Integración de renovables" },
      tagline: { en: "New supply, same standard of judgment.", es: "Nueva oferta, el mismo estándar de juicio." },
      hover: {
        en: "Solar, wind, storage, and hybrid options judged as investments, not as emblems.",
        es: "Opciones solares, eólicas, de almacenamiento e híbridas, juzgadas como inversiones y no como emblemas.",
      },
      body: {
        en: "We advise on how renewable and hybrid systems belong inside an existing portfolio: reliability, return, and the partnership that should hold the operating risk.",
        es: "Asesoramos cómo los sistemas renovables e híbridos pertenecen a un portafolio existente: confiabilidad, retorno y la alianza que debe cargar el riesgo operativo.",
      },
      bullets: [
        { en: "Portfolio fit for renewable options", es: "Encaje de las opciones renovables en el portafolio" },
        { en: "Hybrid-system logic", es: "Lógica de sistemas híbridos" },
        { en: "Partnership and capital structure", es: "Alianza y estructura de capital" },
        { en: "A clear line: we do not develop or operate the plant", es: "Una línea clara: no desarrollamos ni operamos la planta" },
      ],
      cta: { en: "Assess Renewable Options", es: "Evaluar opciones renovables" },
    },
    {
      id: "ccs",
      title: { en: "Carbon Capture & Storage", es: "Captura y almacenamiento de carbono" },
      tagline: { en: "Judge it before you announce it.", es: "Juzgarlo antes de anunciarlo." },
      hover: {
        en: "Feasibility, storage, policy, and credits — advised as a strategy, not operated as a facility.",
        es: "Factibilidad, almacenamiento, política y créditos, asesorados como estrategia y no operados como instalación.",
      },
      body: {
        en: "CCS advice covers whether capture belongs in the transition plan, what it costs, and how credits or incentives change the case. We do not build or operate capture, transport, or storage.",
        es: "La asesoría de CCS cubre si la captura pertenece al plan de transición, cuánto cuesta y cómo los créditos o los incentivos cambian el caso. No construimos ni operamos captura, transporte ni almacenamiento.",
      },
      bullets: [
        { en: "Fit inside the wider transition plan", es: "Encaje dentro del plan de transición" },
        { en: "Cost and feasibility framing", es: "Encuadre de costo y factibilidad" },
        { en: "Policy and credit logic", es: "Lógica de política y de créditos" },
        { en: "Storage and monitoring questions, advised", es: "Preguntas de almacenamiento y monitoreo, en clave de asesoría" },
      ],
      cta: { en: "Request a CCS Session", es: "Solicitar una sesión de CCS" },
    },
    {
      id: "circular",
      title: { en: "Circular Economy Models", es: "Modelos de economía circular" },
      tagline: { en: "Waste, residue, and a second use.", es: "Residuo, remanente y un segundo uso." },
      hover: {
        en: "We look for circular options that reduce cost and exposure, especially around industrial and resource operations.",
        es: "Buscamos opciones circulares que reduzcan costo y exposición, sobre todo alrededor de operaciones industriales y de recursos.",
      },
      body: {
        en: "Circular models are useful when they change the economics of a residue, a by-product, or a material loop. We advise on which loops are real for an industrial or resource business and which are only a metaphor.",
        es: "Los modelos circulares sirven cuando cambian la economía de un residuo, un subproducto o un ciclo de materiales. Asesoramos qué ciclos son reales para un negocio industrial o de recursos y cuáles son solo una metáfora.",
      },
      bullets: [
        { en: "Residue and by-product opportunity scan", es: "Lectura de oportunidades en residuos y subproductos" },
        { en: "Partner models for a second use", es: "Modelos de alianza para un segundo uso" },
        { en: "Cost and compliance implications", es: "Implicaciones de costo y de cumplimiento" },
        { en: "No operating role in the loop", es: "Ningún rol operativo dentro del ciclo" },
      ],
      cta: { en: "Explore a Circular Model", es: "Explorar un modelo circular" },
    },
    {
      id: "climate-risk",
      title: { en: "Climate Risk Assessment", es: "Evaluación de riesgo climático" },
      tagline: { en: "Physical risk, transition risk, and the balance sheet.", es: "Riesgo físico, riesgo de transición y el balance." },
      hover: {
        en: "We translate climate exposure into decisions about assets, insurance, disclosure, and capital.",
        es: "Traducimos la exposición climática en decisiones sobre activos, seguros, divulgación y capital.",
      },
      body: {
        en: "Climate risk work asks what a flood, a drought, a carbon price, or a stranded contract would do to the business. The output is a management view, not a decorative heatmap.",
        es: "El trabajo de riesgo climático pregunta qué le harían al negocio una inundación, una sequía, un precio al carbono o un contrato varado. El resultado es una vista de gestión, no un mapa decorativo.",
      },
      bullets: [
        { en: "Physical and transition exposure", es: "Exposición física y de transición" },
        { en: "Asset and contract implications", es: "Implicaciones para activos y contratos" },
        { en: "Disclosure that matches the risk", es: "Una divulgación que corresponde al riesgo" },
        { en: "Priorities a board can fund", es: "Prioridades que un directorio puede financiar" },
      ],
      cta: { en: "Assess Climate Risk", es: "Evaluar el riesgo climático" },
    },
    {
      id: "pillars",
      title: { en: "Stewardship & Long-Term Value", es: "Cuidado y valor de largo plazo" },
      tagline: { en: "People, environment, and the years after the closing.", es: "Personas, entorno y los años posteriores al cierre." },
      hover: {
        en: "Environmental stewardship, community development, ethical practice, and value that is still there when the cycle turns.",
        es: "Cuidado ambiental, desarrollo de la comunidad, práctica ética y un valor que sigue ahí cuando el ciclo gira.",
      },
      body: {
        en: "Four commitments sit under every sustainability mandate: environmental stewardship, community development, ethical practice, and long-term value. They are how we judge whether a resource strategy deserves capital.",
        es: "Cuatro compromisos sostienen cada mandato de sostenibilidad: cuidado ambiental, desarrollo de la comunidad, práctica ética y valor de largo plazo. Son la forma en que juzgamos si una estrategia de recursos merece capital.",
      },
      bullets: [
        { en: "Environmental stewardship", es: "Cuidado ambiental" },
        { en: "Community development", es: "Desarrollo de comunidades" },
        { en: "Ethical practice", es: "Práctica ética" },
        { en: "Long-term value for investors and neighbors", es: "Valor de largo plazo para inversionistas y vecinos" },
      ],
      cta: { en: "Discuss Responsible Development", es: "Conversar sobre desarrollo responsable" },
    },
  ],
};
