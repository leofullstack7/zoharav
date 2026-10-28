import type { FaqItem, Service } from "../types";

const faqs: FaqItem[] = [
  {
    id: "fin-scope",
    category: "service",
    service: "investment-financial-advisory",
    showOnHome: false,
    question: {
      en: "What kinds of projects do you finance-advise?",
      es: "¿Qué tipo de proyectos asesoran en financiamiento?",
    },
    answer: {
      en: "Energy, mining, and sustainable infrastructure. The work includes valuation, capital raising, project finance, and green-financing structures such as green bonds where they fit. We advise. We are not a bank, a fund, or a broker of the underlying commodity.",
      es: "Energía, minería e infraestructura sostenible. El trabajo incluye valoración, levantamiento de capital, project finance y estructuras de financiamiento verde, como bonos verdes, cuando encajan. Asesoramos. No somos un banco, un fondo ni un intermediario del commodity subyacente.",
    },
  },
  {
    id: "fin-credit",
    category: "service",
    service: "investment-financial-advisory",
    showOnHome: false,
    question: {
      en: "Is the USD $500 session separate from a financing mandate?",
      es: "¿La sesión de USD $500 es distinta de un mandato de financiamiento?",
    },
    answer: {
      en: "Yes. The session is a diagnostic and a proposal. If a mandate follows, the reservation is credited toward it. Financing advice after that point is scoped and contracted on its own terms.",
      es: "Sí. La sesión es un diagnóstico y una propuesta. Si después hay un mandato, la reserva se acredita a ese mandato. La asesoría de financiamiento posterior se define y se contrata en sus propios términos.",
    },
  },
  {
    id: "fin-hedge",
    category: "service",
    service: "investment-financial-advisory",
    showOnHome: false,
    question: {
      en: "Do you execute commodity or currency trades?",
      es: "¿Ejecutan operaciones de commodities o de divisas?",
    },
    answer: {
      en: "No. We advise on risk, hedging policy, and the instruments a treasury might consider. Execution stays with the client and its licensed counterparties.",
      es: "No. Asesoramos el riesgo, la política de cobertura y los instrumentos que una tesorería podría considerar. La ejecución queda en el cliente y en sus contrapartes autorizadas.",
    },
  },
];

export const investment: Service = {
  slug: "investment-financial-advisory",
  number: "05",
  name: { en: "Investment & Financial Advisory", es: "Asesoría de inversión y finanzas" },
  cardLine: {
    en: "Capital for energy, mining, and sustainable infrastructure.",
    es: "Capital para energía, minería e infraestructura sostenible.",
  },
  heroTitle: { en: "Investment & Financial Advisory", es: "Asesoría de inversión y finanzas" },
  heroIntro: {
    en: "From capital structuring to a financial diagnostic, we help you take complex decisions with a clear eye. The focus is green financing, project finance, and the risk of resource markets — as advisors, never as traders of the commodity.",
    es: "De la estructuración de capital a un diagnóstico financiero, ayudamos a tomar decisiones complejas con la mirada clara. El foco es el financiamiento verde, el project finance y el riesgo de los mercados de recursos, como asesores y nunca como traders del commodity.",
  },
  image: "/images/investment/handshake.svg",
  industries: ["financial", "energy-utilities", "oil-gas", "mining", "public-sector"],
  faqs,
  slides: [
    {
      title: { en: "Capital Structuring & Optimization", es: "Estructuración y optimización de capital" },
      body: {
        en: "We advise on how debt and equity should be arranged so the financing matches the life of the asset. That includes funding strategy and restructuring when a resource project is under stress.",
        es: "Asesoramos cómo deben ordenarse la deuda y el equity para que el financiamiento coincida con la vida del activo. Incluye la estrategia de fondeo y la reestructuración cuando un proyecto de recursos está bajo tensión.",
      },
    },
    {
      title: { en: "Investment Analysis & Valuation", es: "Análisis de inversión y valoración" },
      body: {
        en: "Modeling, sensitivity, and sector comparison, so a capital decision in energy or mining can be defended. The frameworks are built for high-stakes rooms.",
        es: "Modelación, sensibilidad y comparación de sector, para que una decisión de capital en energía o minería pueda defenderse. Los marcos están hechos para salas de alta exigencia.",
      },
    },
    {
      title: { en: "Risk & Financial Resilience", es: "Riesgo y resiliencia financiera" },
      body: {
        en: "Exposure, stress, and the mitigation that protects capital when prices, rates, or politics move. Continuity is designed, not hoped for.",
        es: "Exposición, tensión y la mitigación que protege el capital cuando se mueven los precios, las tasas o la política. La continuidad se diseña, no se espera.",
      },
    },
  ],
  methodologies: [
    {
      id: "analyze-monitor",
      name: { en: "Analyze / Structure / Execute / Monitor", es: "Analizar / Estructurar / Ejecutar / Vigilar" },
      intro: {
        en: "Measurable financial outcomes through rigorous analysis.",
        es: "Resultados financieros que se pueden medir, mediante un análisis riguroso.",
      },
      phases: [
        {
          step: "01",
          title: { en: "Analyze", es: "Analizar" },
          body: {
            en: "A financial diagnostic of the current state, the constraint, and the size of the opportunity.",
            es: "Un diagnóstico financiero del estado actual, de la restricción y del tamaño de la oportunidad.",
          },
        },
        {
          step: "02",
          title: { en: "Structure", es: "Estructurar" },
          body: {
            en: "The capital structure, the instrument, and the risk allocation that fit the asset and the sponsor.",
            es: "La estructura de capital, el instrumento y el reparto de riesgo que encajan con el activo y con el patrocinador.",
          },
        },
        {
          step: "03",
          title: { en: "Execute", es: "Ejecutar" },
          body: {
            en: "Support through the raise, the partnership, or the close. We do not replace the client’s counsel or its lenders.",
            es: "Acompañamiento durante la ronda, la alianza o el cierre. No reemplazamos a los abogados del cliente ni a sus prestamistas.",
          },
        },
        {
          step: "04",
          title: { en: "Monitor", es: "Vigilar" },
          body: {
            en: "Follow-up so the structure still works when volumes, prices, or covenants move.",
            es: "Seguimiento para que la estructura siga funcionando cuando se mueven los volúmenes, los precios o los covenants.",
          },
        },
      ],
    },
  ],
  subServices: [
    {
      id: "capital-structuring",
      title: { en: "Capital Structuring", es: "Estructuración de capital" },
      tagline: { en: "Debt, equity, and room to breathe.", es: "Deuda, equity y margen para respirar." },
      hover: {
        en: "Flexible structures that balance leverage, cost of capital, and the strategic freedom a resource project still needs.",
        es: "Estructuras flexibles que equilibran apalancamiento, costo de capital y la libertad estratégica que un proyecto de recursos todavía necesita.",
      },
      body: {
        en: "We design capital structures for energy, mining, and infrastructure situations: how much debt the asset can carry, where equity should sit, and what flexibility the next phase will require.",
        es: "Diseñamos estructuras de capital para situaciones de energía, minería e infraestructura: cuánta deuda puede cargar el activo, dónde debe sentarse el equity y qué flexibilidad exigirá la fase siguiente.",
      },
      bullets: [
        { en: "Debt and equity mix for long-cycle assets", es: "Mezcla de deuda y equity para activos de ciclo largo" },
        { en: "Cost of capital and flexibility", es: "Costo de capital y flexibilidad" },
        { en: "Readiness for a raise or a partnership", es: "Preparación para una ronda o una alianza" },
        { en: "Green-financing options where they belong", es: "Opciones de financiamiento verde donde corresponden" },
      ],
      cta: { en: "Structure the Capital", es: "Estructurar el capital" },
    },
    {
      id: "project-evaluation",
      title: { en: "Project Evaluation", es: "Evaluación de proyectos" },
      tagline: { en: "Feasibility, return, and the risk case.", es: "Factibilidad, retorno y el caso de riesgo." },
      hover: {
        en: "Every commitment is read with a model built for the sector, so capital is allocated with eyes open.",
        es: "Cada compromiso se lee con un modelo hecho para el sector, para que el capital se asigne con los ojos abiertos.",
      },
      body: {
        en: "Feasibility, return, and scenarios — including the one in which the commodity disappoints. Evaluation is how a sponsor decides, not how a project is decorated.",
        es: "Factibilidad, retorno y escenarios, incluido aquel en el que el commodity decepciona. La evaluación es la forma en que un patrocinador decide, no la forma en que se decora un proyecto.",
      },
      bullets: [
        { en: "Feasibility and return analysis", es: "Análisis de factibilidad y retorno" },
        { en: "Sector-specific scenarios", es: "Escenarios propios del sector" },
        { en: "Capital allocation advice", es: "Consejo de asignación de capital" },
        { en: "A recommendation to proceed or to wait", es: "Una recomendación de avanzar o de esperar" },
      ],
      cta: { en: "Evaluate a Project", es: "Evaluar un proyecto" },
    },
    {
      id: "valuation",
      title: { en: "Valuation & Financial Modeling", es: "Valoración y modelación financiera" },
      tagline: { en: "A number that can survive a question.", es: "Un número que puede sobrevivir a una pregunta." },
      hover: {
        en: "Methods consistent with international valuation practice, tailored to energy, mining, and infrastructure, and written so investors and auditors can follow them.",
        es: "Métodos consistentes con la práctica internacional de valoración, ajustados a energía, minería e infraestructura, y escritos para que inversionistas y auditores puedan seguirlos.",
      },
      body: {
        en: "Valuation and modeling support transactions, capital allocation, and planning. We use discounted cash flow, comparables, and precedent transactions where they are honest, and we say when the information is not good enough for a precise figure.",
        es: "La valoración y la modelación apoyan transacciones, asignación de capital y planeación. Usamos flujo de caja descontado, comparables y transacciones precedentes cuando son honestos, y decimos cuándo la información no alcanza para una cifra precisa.",
      },
      bullets: [
        { en: "Business and asset valuation", es: "Valoración de negocios y de activos" },
        { en: "Models for partnerships, raises, and planning", es: "Modelos para alianzas, rondas y planeación" },
        { en: "Independent views and fairness support", es: "Opiniones independientes y apoyo de fairness" },
        { en: "Portfolio-level modeling", es: "Modelación a nivel de portafolio" },
      ],
      cta: { en: "Request a Valuation Analysis", es: "Solicitar un análisis de valoración" },
    },
    {
      id: "capital-raising",
      title: { en: "Capital Raising", es: "Levantamiento de capital" },
      tagline: { en: "The right money, on terms the asset can live with.", es: "El dinero correcto, en términos con los que el activo pueda vivir." },
      hover: {
        en: "From the materials to the investor conversation and the close, aimed at financing that matches the strategy and respects dilution and cost.",
        es: "De los materiales a la conversación con inversionistas y al cierre, con un financiamiento que coincida con la estrategia y respete la dilución y el costo.",
      },
      body: {
        en: "We support equity and debt raises for energy, mining, and sustainable infrastructure: private capital, project-level debt, bonds including green bonds, and the investor narrative that has to be true. We do not custody funds and we do not sell securities.",
        es: "Acompañamos rondas de equity y de deuda para energía, minería e infraestructura sostenible: capital privado, deuda de proyecto, bonos —incluidos los verdes— y la narrativa para inversionistas, que tiene que ser verdadera. No custodiamos fondos ni vendemos valores.",
      },
      bullets: [
        { en: "Equity processes with private capital", es: "Procesos de equity con capital privado" },
        { en: "Debt, mezzanine, and bond options", es: "Opciones de deuda, mezzanine y bonos" },
        { en: "Project finance and green-financing structures", es: "Project finance y estructuras de financiamiento verde" },
        { en: "Investor materials and process support", es: "Materiales para inversionistas y apoyo al proceso" },
      ],
      cta: { en: "Explore Capital Options", es: "Explorar opciones de capital" },
    },
    {
      id: "ma",
      title: { en: "M&A Advisory", es: "Asesoría en fusiones y adquisiciones" },
      tagline: { en: "From the first conversation to integration.", es: "De la primera conversación a la integración." },
      hover: {
        en: "Buy-side, sell-side, and joint ventures, with value protected and execution risk named early.",
        es: "Compra, venta y empresas conjuntas, con el valor protegido y el riesgo de ejecución nombrado pronto.",
      },
      body: {
        en: "Mergers, acquisitions, and strategic partnerships in resource markets are slow to undo. We support both sides of a transaction and the joint ventures that are often the better answer. We do not acquire the target.",
        es: "Las fusiones, las adquisiciones y las alianzas en mercados de recursos son lentas de deshacer. Acompañamos ambos lados de una transacción y las empresas conjuntas que a menudo son la mejor respuesta. No adquirimos el objetivo.",
      },
      bullets: [
        { en: "Buy-side identification and negotiation support", es: "Identificación y apoyo de negociación en compra" },
        { en: "Sell-side positioning and process", es: "Posicionamiento y proceso de venta" },
        { en: "Joint-venture structuring", es: "Estructuración de empresas conjuntas" },
        { en: "Cross-border regulatory questions, flagged early", es: "Preguntas regulatorias transfronterizas, marcadas pronto" },
      ],
      cta: { en: "Discuss a Transaction", es: "Conversar una transacción" },
    },
    {
      id: "diligence",
      title: { en: "Due Diligence & Deal Readiness", es: "Debida diligencia y preparación de la transacción" },
      tagline: { en: "Find the surprise before the other side does.", es: "Encontrar la sorpresa antes de que la encuentre la otra parte." },
      hover: {
        en: "Financial, commercial, and operating diligence that informs price, terms, and whether to walk away.",
        es: "Diligencia financiera, comercial y operativa que informa el precio, los términos y la decisión de retirarse.",
      },
      body: {
        en: "Diligence is the foundation of a transaction that does not sour after closing. We review earnings quality, working capital, commercial concentration, and the operating reality of energy and mining assets. Information-system trivia is not the point; the asset and the cash are.",
        es: "La diligencia es la base de una transacción que no se agria después del cierre. Revisamos calidad de las utilidades, capital de trabajo, concentración comercial y la realidad operativa de activos de energía y minería. El detalle de sistemas no es el punto; el activo y la caja sí lo son.",
      },
      bullets: [
        { en: "Quality of earnings, working capital, and debt", es: "Calidad de utilidades, capital de trabajo y deuda" },
        { en: "Commercial diligence and customer or offtake concentration", es: "Diligencia comercial y concentración de clientes u offtake" },
        { en: "Operating diligence on assets and supply", es: "Diligencia operativa de activos y suministro" },
        { en: "Sell-side readiness", es: "Preparación del lado vendedor" },
      ],
      cta: { en: "Prepare the Transaction", es: "Preparar la transacción" },
    },
    {
      id: "project-finance",
      title: { en: "Project Finance & PPP Structuring", es: "Project finance y estructuración de APP" },
      tagline: { en: "Risk in the right hands.", es: "El riesgo en las manos correctas." },
      hover: {
        en: "With sponsors, governments, and lenders, we shape financings that are viable, sustainable, and faithful to the project’s economics.",
        es: "Con patrocinadores, gobiernos y prestamistas, damos forma a financiamientos viables, sostenibles y fieles a la economía del proyecto.",
      },
      body: {
        en: "Large energy and infrastructure projects need a structure that allocates risk and attracts institutional capital. We advise on project finance and public-private partnerships, including green and sustainability-linked features where the asset earns them. We are not the lender and not the concessionaire.",
        es: "Los grandes proyectos de energía e infraestructura necesitan una estructura que reparta el riesgo y atraiga capital institucional. Asesoramos project finance y asociaciones público-privadas, incluidos rasgos verdes o ligados a sostenibilidad cuando el activo los merece. No somos el prestamista ni el concesionario.",
      },
      bullets: [
        { en: "Project-finance structure and model", es: "Estructura y modelo de project finance" },
        { en: "Public-private partnership advisory", es: "Asesoría de asociaciones público-privadas" },
        { en: "Risk allocation and credit support logic", es: "Reparto de riesgo y lógica de soporte crediticio" },
        { en: "Support toward financial close", es: "Acompañamiento hacia el cierre financiero" },
      ],
      cta: { en: "Structure a Project", es: "Estructurar un proyecto" },
    },
    {
      id: "risk-hedging",
      title: { en: "Risk Management & Hedging", es: "Gestión de riesgo y cobertura" },
      tagline: { en: "Commodities, currency, and rates.", es: "Commodities, divisas y tasas." },
      hover: {
        en: "A hedging policy that matches risk appetite, regulation, and the way the operation actually sells.",
        es: "Una política de cobertura que coincide con el apetito de riesgo, la regulación y la forma en que la operación vende de verdad.",
      },
      body: {
        en: "Commodity prices, foreign exchange, and interest rates can erase a good operating year. We help identify, measure, and design hedges and treasury policy. We do not execute trades and we do not sell derivatives.",
        es: "Los precios de los commodities, el tipo de cambio y las tasas pueden borrar un buen año operativo. Ayudamos a identificar, medir y diseñar coberturas y política de tesorería. No ejecutamos operaciones ni vendemos derivados.",
      },
      bullets: [
        { en: "Commodity, FX, and rate exposure", es: "Exposición a commodities, divisas y tasas" },
        { en: "Hedge-policy design", es: "Diseño de política de cobertura" },
        { en: "Instrument choice, advised not executed", es: "Elección de instrumentos, asesorada y no ejecutada" },
        { en: "Treasury governance", es: "Gobierno de tesorería" },
      ],
      cta: { en: "Assess Risk Exposure", es: "Evaluar la exposición al riesgo" },
    },
    {
      id: "restructuring",
      title: { en: "Restructuring & Turnaround", es: "Reestructuración y recuperación" },
      tagline: { en: "Stability first. Then a plan that can be funded.", es: "Primero la estabilidad. Después un plan que se pueda fondear." },
      hover: {
        en: "When a resource project or its sponsor is under stress, we help restore liquidity, renegotiate the capital structure, and give stakeholders a plan they can monitor.",
        es: "Cuando un proyecto de recursos o su patrocinador está bajo tensión, ayudamos a recuperar liquidez, renegociar la estructura de capital y dar a las partes un plan que puedan vigilar.",
      },
      body: {
        en: "Stress in energy, mining, and infrastructure rarely arrives as a surprise to the people closest to the numbers. We advise sponsors and creditors on liquidity, a workable capital structure, stakeholder negotiations, and a turnaround plan with indicators. We do not take control of the asset and we do not replace insolvency counsel.",
        es: "La tensión en energía, minería e infraestructura rara vez sorprende a quienes están cerca de los números. Asesoramos a patrocinadores y acreedores sobre liquidez, una estructura de capital viable, la negociación entre partes y un plan de recuperación con indicadores. No tomamos el control del activo ni reemplazamos al abogado de insolvencia.",
      },
      bullets: [
        { en: "Liquidity and cash diagnostic", es: "Diagnóstico de liquidez y de caja" },
        { en: "Capital-structure options under stress", es: "Opciones de estructura de capital bajo tensión" },
        { en: "Stakeholder and creditor negotiation support", es: "Apoyo en la negociación con partes y acreedores" },
        { en: "A turnaround plan and a way to monitor it", es: "Un plan de recuperación y una forma de vigilarlo" },
      ],
      cta: { en: "Discuss a Turnaround", es: "Conversar una recuperación" },
    },
    {
      id: "fpa",
      title: { en: "Financial Planning & Reporting", es: "Planeación financiera y reportería" },
      tagline: { en: "A management view, on time.", es: "Una vista de gestión, a tiempo." },
      hover: {
        en: "Planning, forecasting, and reporting that let leadership decide before the quarter has already happened.",
        es: "Planeación, pronóstico y reportería que permiten decidir antes de que el trimestre ya haya ocurrido.",
      },
      body: {
        en: "We help organizations build planning cadence, management reporting, and scenarios worthy of a resource business. The advice is about the function and the decisions. It is not a software implementation.",
        es: "Ayudamos a construir el ritmo de planeación, la reportería de gestión y escenarios dignos de un negocio de recursos. El consejo es sobre la función y las decisiones. No es una implementación de software.",
      },
      bullets: [
        { en: "Planning and budgeting cadence", es: "Ritmo de planeación y presupuesto" },
        { en: "Management reporting and indicators", es: "Reportería de gestión e indicadores" },
        { en: "Forecasts and scenarios", es: "Pronósticos y escenarios" },
        { en: "An FP&A function designed for decisions", es: "Una función de planeación financiera diseñada para decidir" },
      ],
      cta: { en: "Strengthen Planning", es: "Fortalecer la planeación" },
    },
  ],
};
