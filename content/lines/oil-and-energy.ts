import type { FaqItem, Service } from "../types";

const faqs: FaqItem[] = [
  {
    id: "oil-scope",
    category: "service",
    service: "oil-and-energy",
    showOnHome: false,
    question: {
      en: "Does Zoharav participate in exploration, production, or the sale of oil and gas?",
      es: "¿Zoharav participa en la exploración, la producción o la venta de petróleo y gas?",
    },
    answer: {
      en: "No. Zoharav is a consulting firm. We advise on exploration and production strategy, infrastructure, regulation, and partnerships. We do not explore, extract, refine, market, broker, or transport petroleum or gas.",
      es: "No. Zoharav es una firma de consultoría. Asesoramos sobre estrategia de exploración y producción, infraestructura, regulación y alianzas. No exploramos, extraemos, refinamos, comercializamos, intermediamos ni transportamos petróleo o gas.",
    },
  },
  {
    id: "oil-entry",
    category: "service",
    service: "oil-and-energy",
    showOnHome: false,
    question: {
      en: "Can you advise on entering a new oil and gas market?",
      es: "¿Pueden asesorar el ingreso a un nuevo mercado de petróleo y gas?",
    },
    answer: {
      en: "Yes. Market-entry work covers where the opportunity sits, what the regulation requires, and how a partnership should be structured. The client remains the operator or the investor. We remain the advisor.",
      es: "Sí. El trabajo de entrada a un mercado cubre dónde está la oportunidad, qué exige la regulación y cómo debe estructurarse una alianza. El cliente sigue siendo el operador o el inversionista. Nosotros seguimos siendo el asesor.",
    },
  },
  {
    id: "oil-risk",
    category: "service",
    service: "oil-and-energy",
    showOnHome: false,
    question: {
      en: "How do you treat commodity and geopolitical risk?",
      es: "¿Cómo tratan el riesgo de commodities y el riesgo geopolítico?",
    },
    answer: {
      en: "Through scenarios, not slogans. Investment strategy work tests price, regulation, and country risk before a partnership or a capital commitment is recommended.",
      es: "Con escenarios, no con consignas. El trabajo de estrategia de inversión prueba precio, regulación y riesgo país antes de recomendar una alianza o un compromiso de capital.",
    },
  },
];

export const oilAndEnergy: Service = {
  slug: "oil-and-energy",
  number: "02",
  name: { en: "Oil & Energy Advisory", es: "Asesoría en petróleo y energía" },
  cardLine: {
    en: "Exploration, development, and partnerships — always as counsel.",
    es: "Exploración, desarrollo y alianzas, siempre como consejo.",
  },
  heroTitle: { en: "Oil & Energy Advisory", es: "Asesoría en petróleo y energía" },
  heroIntro: {
    en: "Strategic consulting across the energy value chain: exploration and production advisory, infrastructure, government relations, and the transition. Powering opportunities does not mean lifting the barrel. We never do.",
    es: "Consultoría estratégica a lo largo de la cadena energética: asesoría de exploración y producción, infraestructura, relaciones con gobiernos y la transición. Impulsar oportunidades no significa levantar el barril. Nunca lo hacemos.",
  },
  image: "/images/pillars/oil-energy.svg",
  industries: ["oil-gas", "energy-utilities", "logistics"],
  faqs,
  methodologies: [
    {
      id: "discover",
      name: { en: "Discover / Design / Deliver / Optimize", es: "Descubrir / Diseñar / Entregar / Optimizar" },
      intro: {
        en: "The same four-phase discipline we use on strategic mandates, applied to energy decisions.",
        es: "La misma disciplina de cuatro fases que usamos en mandatos estratégicos, aplicada a las decisiones de energía.",
      },
      phases: [
        {
          step: "01",
          title: { en: "Discover", es: "Descubrir" },
          body: {
            en: "Interviews, asset context, and a competitive reading so the current position is understood before a recommendation is made.",
            es: "Entrevistas, contexto del activo y una lectura competitiva para entender la posición actual antes de hacer una recomendación.",
          },
        },
        {
          step: "02",
          title: { en: "Design", es: "Diseñar" },
          body: {
            en: "A course of action for entry, partnership, or transition, written so a board can decide.",
            es: "Un curso de acción para el ingreso, la alianza o la transición, escrito para que un directorio pueda decidir.",
          },
        },
        {
          step: "03",
          title: { en: "Deliver", es: "Entregar" },
          body: {
            en: "Support while the decision is negotiated and put in motion. We do not take operational control.",
            es: "Acompañamiento mientras la decisión se negocia y se pone en marcha. No tomamos el control operativo.",
          },
        },
        {
          step: "04",
          title: { en: "Optimize", es: "Optimizar" },
          body: {
            en: "Follow-up so the partnership, the market position, or the transition plan still holds when conditions move.",
            es: "Seguimiento para que la alianza, la posición de mercado o el plan de transición sigan en pie cuando cambian las condiciones.",
          },
        },
      ],
    },
  ],
  subServices: [
    {
      id: "exploration-production",
      title: { en: "Exploration & Production Advisory", es: "Asesoría en exploración y producción" },
      tagline: { en: "Judgment on the subsurface strategy. Not the drill bit.", es: "Juicio sobre la estrategia del subsuelo. No la broca." },
      hover: {
        en: "We help sponsors and companies frame exploration and production decisions: where to look, what to farm, and what the capital should refuse.",
        es: "Ayudamos a patrocinadores y compañías a encuadrar decisiones de exploración y producción: dónde mirar, qué asociar y qué debe rechazar el capital.",
      },
      body: {
        en: "Exploration and production advice covers portfolio logic, partner fit, and the questions a technical team and a board need answered before capital moves. Zoharav does not explore, drill, or produce.",
        es: "La asesoría de exploración y producción cubre la lógica del portafolio, el encaje del socio y las preguntas que un equipo técnico y un directorio necesitan resueltas antes de que se mueva el capital. Zoharav no explora, perfora ni produce.",
      },
      bullets: [
        { en: "Portfolio and basin-entry counsel", es: "Consejo de portafolio y de entrada a cuencas" },
        { en: "Farm-in, farm-out, and partner screening", es: "Farm-in, farm-out y filtro de socios" },
        { en: "Capital sequencing for appraisal and development decisions", es: "Secuencia de capital para decisiones de evaluación y desarrollo" },
        { en: "A clear line between advice and operatorship", es: "Una línea clara entre el consejo y la operación" },
      ],
      cta: { en: "Discuss Exploration Advisory", es: "Conversar sobre asesoría de exploración" },
    },
    {
      id: "infrastructure",
      title: { en: "Infrastructure & Logistics", es: "Infraestructura y logística" },
      tagline: { en: "The system around the molecule.", es: "El sistema alrededor de la molécula." },
      hover: {
        en: "Midstream and logistics decisions — corridors, terminals, and offtake — advised with the same care as the upstream choice.",
        es: "Decisiones de midstream y logística — corredores, terminales y offtake — asesoradas con el mismo cuidado que la decisión de upstream.",
      },
      body: {
        en: "We advise on the infrastructure and logistics questions that decide whether a project can actually reach a market: capacity, counterparties, and risk allocation. We do not own, operate, or charter the assets.",
        es: "Asesoramos las preguntas de infraestructura y logística que deciden si un proyecto puede llegar de verdad a un mercado: capacidad, contrapartes y reparto del riesgo. No somos dueños, no operamos ni fletamos los activos.",
      },
      bullets: [
        { en: "Midstream and logistics strategy", es: "Estrategia de midstream y logística" },
        { en: "Counterparty and offtake framing", es: "Encuadre de contrapartes y offtake" },
        { en: "Risk allocation in infrastructure partnerships", es: "Reparto de riesgo en alianzas de infraestructura" },
        { en: "Interface with project finance", es: "Interfaz con project finance" },
      ],
      cta: { en: "Review Infrastructure Options", es: "Revisar opciones de infraestructura" },
    },
    {
      id: "regulatory",
      title: { en: "Regulatory & Government Relations", es: "Regulación y relaciones con gobiernos" },
      tagline: { en: "Read the rules before the capital moves.", es: "Leer las reglas antes de que se mueva el capital." },
      hover: {
        en: "We help clients understand licensing, local content, fiscal terms, and the public conversation around an energy project.",
        es: "Ayudamos a entender licencias, contenido local, términos fiscales y la conversación pública alrededor de un proyecto energético.",
      },
      body: {
        en: "Energy decisions fail as often in the permit and the politics as they do in the reservoir. We advise on the regulatory path and on how a company should show up with governments and communities. We are not a lobby shop and we are not a licensee.",
        es: "Las decisiones de energía fracasan tantas veces en el permiso y en la política como en el yacimiento. Asesoramos el camino regulatorio y la forma en que una compañía debe presentarse ante gobiernos y comunidades. No somos un despacho de cabildeo ni un titular de licencia.",
      },
      bullets: [
        { en: "Licensing and fiscal-term reading", es: "Lectura de licencias y términos fiscales" },
        { en: "Local-content and community context", es: "Contexto de contenido local y de comunidad" },
        { en: "Government engagement strategy", es: "Estrategia de relación con el gobierno" },
        { en: "Sanction-screen awareness on every mandate", es: "Atención al filtro de sanciones en cada mandato" },
      ],
      cta: { en: "Request Regulatory Counsel", es: "Solicitar consejo regulatorio" },
    },
    {
      id: "transition-renewables",
      title: { en: "Energy Transition & Renewables", es: "Transición energética y renovables" },
      tagline: { en: "The next chapter of an energy company.", es: "El capítulo siguiente de una compañía de energía." },
      hover: {
        en: "From hydrocarbons to a mixed portfolio: we advise on what to keep, what to partner, and what a credible transition looks like to capital.",
        es: "De los hidrocarburos a un portafolio mixto: asesoramos qué conservar, con quién asociarse y cómo se ve una transición creíble ante el capital.",
      },
      body: {
        en: "Transition advice for oil and energy companies sits beside the core franchise. We help define renewable and lower-carbon options that belong with the existing business, and we say so when they do not.",
        es: "La asesoría de transición para compañías de petróleo y energía se sienta al lado del negocio central. Ayudamos a definir opciones renovables y de menor carbono que pertenecen al negocio existente, y lo decimos cuando no pertenecen.",
      },
      bullets: [
        { en: "Transition narrative a board can defend", es: "Una narrativa de transición que un directorio pueda defender" },
        { en: "Renewable options judged against the core", es: "Opciones renovables juzgadas frente al negocio central" },
        { en: "Partnership logic for new energy", es: "Lógica de alianzas para la nueva energía" },
        { en: "Link to decarbonization and financing work", es: "Enlace con el trabajo de descarbonización y financiamiento" },
      ],
      cta: { en: "Plan the Transition", es: "Planear la transición" },
    },
    {
      id: "market-entry",
      title: { en: "Market Entry & Expansion", es: "Entrada y expansión de mercado" },
      tagline: { en: "Where to go, and how to arrive.", es: "A dónde ir, y cómo llegar." },
      hover: {
        en: "We identify where upstream, midstream, and downstream opportunities are real, and we build the path into a new or a familiar market.",
        es: "Identificamos dónde las oportunidades de upstream, midstream y downstream son reales, y construimos el camino hacia un mercado nuevo o uno ya conocido.",
      },
      body: {
        en: "We identify high-potential opportunities in upstream, midstream, and downstream activity. The frameworks are there to accelerate entry and to sharpen a position the client already holds. Advisory only.",
        es: "Identificamos oportunidades de alto potencial en actividad upstream, midstream y downstream. Los marcos sirven para acelerar la entrada y para afinar una posición que el cliente ya tiene. Solo asesoría.",
      },
      bullets: [
        { en: "Market screening across the value chain", es: "Filtro de mercados a lo largo de la cadena" },
        { en: "Entry sequencing and local-partner logic", es: "Secuencia de entrada y lógica del socio local" },
        { en: "Positioning in markets the client already knows", es: "Posicionamiento en mercados que el cliente ya conoce" },
        { en: "A stop-go recommendation, not a brochure", es: "Una recomendación de seguir o detenerse, no un folleto" },
      ],
      cta: { en: "Map a Market Entry", es: "Trazar una entrada de mercado" },
    },
    {
      id: "investment-risk",
      title: { en: "Investment Strategy & Risk Mitigation", es: "Estrategia de inversión y mitigación de riesgo" },
      tagline: { en: "Price, politics, and the downside.", es: "Precio, política y el escenario adverso." },
      hover: {
        en: "Geopolitics, commodity prices, and regulatory shifts, tested in scenarios before the investment is loved too much.",
        es: "Geopolítica, precios de commodities y giros regulatorios, probados en escenarios antes de que la inversión se quiera demasiado.",
      },
      body: {
        en: "We help clients navigate geopolitical risk, commodity-price volatility, and regulatory change through investment planning and scenario work. The aim is a decision that still makes sense when the optimistic case does not arrive.",
        es: "Ayudamos a navegar el riesgo geopolítico, la volatilidad del precio y el cambio regulatorio mediante planeación de inversión y trabajo de escenarios. El objetivo es una decisión que siga teniendo sentido cuando el caso optimista no llega.",
      },
      bullets: [
        { en: "Scenario planning for price and country risk", es: "Planeación de escenarios de precio y riesgo país" },
        { en: "Investment pacing and exposure limits", es: "Ritmo de inversión y límites de exposición" },
        { en: "Downside cases written in plain language", es: "Casos adversos escritos en lenguaje claro" },
        { en: "Link to hedging and project-finance advice", es: "Enlace con la asesoría de cobertura y project finance" },
      ],
      cta: { en: "Stress-Test an Investment", es: "Poner a prueba una inversión" },
    },
    {
      id: "partnerships-ma",
      title: { en: "Strategic Partnerships & M&A", es: "Alianzas estratégicas y M&A" },
      tagline: { en: "The right partner is a strategy.", es: "El socio correcto es una estrategia." },
      hover: {
        en: "Joint ventures, alliances, and acquisitions structured so the synergy is real and the governance can survive a disagreement.",
        es: "Empresas conjuntas, alianzas y adquisiciones estructuradas para que la sinergia sea real y el gobierno sobreviva a un desacuerdo.",
      },
      body: {
        en: "From joint ventures to mergers and acquisitions, we structure and help negotiate alliances that unlock growth without hiding the risk. We advise buyers, sellers, and partners. We do not acquire the assets ourselves.",
        es: "De las empresas conjuntas a las fusiones y adquisiciones, estructuramos y ayudamos a negociar alianzas que abren crecimiento sin esconder el riesgo. Asesoramos a compradores, vendedores y socios. No adquirimos los activos por nuestra cuenta.",
      },
      bullets: [
        { en: "Joint-venture and alliance design", es: "Diseño de empresas conjuntas y alianzas" },
        { en: "Buy-side and sell-side support", es: "Acompañamiento de compra y de venta" },
        { en: "Governance that assumes disagreement", es: "Un gobierno que asume el desacuerdo" },
        { en: "Integration questions asked before signing", es: "Las preguntas de integración, hechas antes de firmar" },
      ],
      cta: { en: "Structure a Partnership", es: "Estructurar una alianza" },
    },
  ],
};
