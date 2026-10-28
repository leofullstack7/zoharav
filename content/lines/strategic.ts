import type { FaqItem, Service } from "../types";

const faqs: FaqItem[] = [
  {
    id: "ops-tech",
    category: "service",
    service: "strategic-operational-consulting",
    showOnHome: false,
    question: {
      en: "Do you implement automation, software, or digital programs?",
      es: "¿Implementan automatización, software o programas digitales?",
    },
    answer: {
      en: "No. Operational consulting at Zoharav covers process, supply chain, asset performance, indicators, and risk — including environmental and safety management systems. We do not sell technology implementation.",
      es: "No. La consultoría operativa de Zoharav cubre procesos, cadena de suministro, desempeño de activos, indicadores y riesgo, incluidos los sistemas de gestión ambiental y de seguridad. No vendemos implementación tecnológica.",
    },
  },
  {
    id: "ops-iso",
    category: "service",
    service: "strategic-operational-consulting",
    showOnHome: false,
    question: {
      en: "Can you advise on ISO 14001 and ISO 45001?",
      es: "¿Pueden asesorar sobre ISO 14001 e ISO 45001?",
    },
    answer: {
      en: "Yes, as advisory on environmental and occupational-safety management systems and on readiness for those standards. We do not claim that Zoharav itself is certified under them, and we are not a certification body.",
      es: "Sí, como asesoría sobre sistemas de gestión ambiental y de seguridad ocupacional y sobre la preparación frente a esas normas. No afirmamos que Zoharav esté certificada en ellas, y no somos un organismo de certificación.",
    },
  },
  {
    id: "ops-strategy",
    category: "service",
    service: "strategic-operational-consulting",
    showOnHome: false,
    question: {
      en: "Is strategy separate from operations?",
      es: "¿La estrategia está separada de la operación?",
    },
    answer: {
      en: "They are one line of work because a strategy that cannot be operated is a presentation. We stay through implementation. We do not take over the client’s operation.",
      es: "Son una sola línea de trabajo porque una estrategia que no se puede operar es una presentación. Acompañamos la implementación. No nos hacemos cargo de la operación del cliente.",
    },
  },
];

export const strategic: Service = {
  slug: "strategic-operational-consulting",
  number: "06",
  name: {
    en: "Strategic & Operational Consulting",
    es: "Consultoría estratégica y operativa",
  },
  cardLine: {
    en: "Strategy that can be run, and operations that can be trusted.",
    es: "Estrategia que se puede ejecutar y operaciones en las que se puede confiar.",
  },
  heroTitle: {
    en: "Strategic & Operational Consulting",
    es: "Consultoría estratégica y operativa",
  },
  heroIntro: {
    en: "Corporate strategy, market intelligence, partnerships, and the operating work that makes them real: lean processes, supply and assets, indicators, and risk. For natural resources and the industries around them.",
    es: "Estrategia corporativa, inteligencia de mercado, alianzas y el trabajo operativo que las vuelve reales: procesos lean, suministro y activos, indicadores y riesgo. Para los recursos naturales y las industrias que los rodean.",
  },
  image: "/images/services/jet.svg",
  industries: ["manufacturing", "energy-utilities", "mining", "logistics", "financial", "public-sector"],
  faqs,
  slides: [
    {
      title: { en: "Strategic insight you can act on", es: "Criterio estratégico que se puede ejecutar" },
      body: {
        en: "Clients rely on us for more than a reading. We deliver a roadmap, regional judgment, and support inside complex energy and resource markets.",
        es: "Los clientes cuentan con nosotros para algo más que una lectura. Entregamos una hoja de ruta, juicio regional y acompañamiento dentro de mercados complejos de energía y recursos.",
      },
    },
    {
      title: { en: "Counsel when the market will not sit still", es: "Consejo cuando el mercado no se queda quieto" },
      body: {
        en: "Price, policy, and community expectations move. We help leadership decide with a clear downside, a defined partner, and an operating plan that can absorb the change.",
        es: "El precio, la política y las expectativas de las comunidades se mueven. Ayudamos a la dirección a decidir con un escenario adverso claro, un socio definido y un plan operativo capaz de absorber el cambio.",
      },
    },
    {
      title: { en: "Not just strategy. Implementation.", es: "No solo estrategia. Implementación." },
      body: {
        en: "We go beyond the boardroom. Consultants work with the teams who have to run the plan, on site when the mandate requires it, until the result can be measured.",
        es: "Vamos más allá de la sala de directorio. Los consultores trabajan con los equipos que tienen que ejecutar el plan, en campo cuando el mandato lo exige, hasta que el resultado se pueda medir.",
      },
    },
  ],
  methodologies: [
    {
      id: "discover",
      name: { en: "Discover / Design / Deliver / Optimize", es: "Descubrir / Diseñar / Entregar / Optimizar" },
      intro: {
        en: "For strategic mandates.",
        es: "Para mandatos estratégicos.",
      },
      phases: [
        {
          step: "01",
          title: { en: "Discover", es: "Descubrir" },
          body: {
            en: "Interviews, evidence, and a competitive reading of the current state and the opening.",
            es: "Entrevistas, evidencia y una lectura competitiva del estado actual y de la apertura.",
          },
        },
        {
          step: "02",
          title: { en: "Design", es: "Diseñar" },
          body: {
            en: "A roadmap aligned with ambition, capability, and the market as it is.",
            es: "Una hoja de ruta alineada con la ambición, la capacidad y el mercado tal como es.",
          },
        },
        {
          step: "03",
          title: { en: "Deliver", es: "Entregar" },
          body: {
            en: "Implementation support so the strategy becomes an operating change.",
            es: "Acompañamiento de implementación para que la estrategia se vuelva un cambio operativo.",
          },
        },
        {
          step: "04",
          title: { en: "Optimize", es: "Optimizar" },
          body: {
            en: "Monitoring and capability so the result survives the next quarter.",
            es: "Seguimiento y capacidad para que el resultado sobreviva al trimestre siguiente.",
          },
        },
      ],
    },
    {
      id: "diagnose",
      name: { en: "Diagnose / Design / Implement / Sustain", es: "Diagnosticar / Diseñar / Implementar / Sostener" },
      intro: {
        en: "For operational mandates.",
        es: "Para mandatos operativos.",
      },
      phases: [
        {
          step: "01",
          title: { en: "Diagnose", es: "Diagnosticar" },
          body: {
            en: "An operating assessment across process, assets, and the organization’s ability to hold a gain.",
            es: "Una evaluación operativa de procesos, activos y la capacidad de la organización para sostener una mejora.",
          },
        },
        {
          step: "02",
          title: { en: "Design", es: "Diseñar" },
          body: {
            en: "The operating model and the process design, agreed with the people who will run them.",
            es: "El modelo operativo y el diseño del proceso, acordados con quienes van a ejecutarlos.",
          },
        },
        {
          step: "03",
          title: { en: "Implement", es: "Implementar" },
          body: {
            en: "Change support, training, and presence while the new way of working takes hold.",
            es: "Apoyo al cambio, formación y presencia mientras la nueva forma de trabajar se afirma.",
          },
        },
        {
          step: "04",
          title: { en: "Sustain", es: "Sostener" },
          body: {
            en: "Indicators and a cadence of improvement so the gain does not leak away.",
            es: "Indicadores y un ritmo de mejora para que la ganancia no se escape.",
          },
        },
      ],
    },
  ],
  subServices: [
    {
      id: "corporate-strategy",
      title: { en: "Corporate Strategy & Transformation", es: "Estrategia corporativa y transformación" },
      tagline: { en: "A model the next decade can live in.", es: "Un modelo en el que pueda vivir la próxima década." },
      hover: {
        en: "Whether the need is a repositioning, an operating redesign, or a renewal, the method is there so the change reaches its aim.",
        es: "Ya sea un reposicionamiento, un rediseño operativo o una renovación, el método existe para que el cambio alcance su propósito.",
      },
      body: {
        en: "We work with chief executives on transformation strategies that improve position and resilience in resource and industrial markets. The age is not an excuse to sell technology. The work is the strategy and the change itself.",
        es: "Trabajamos con la alta dirección en estrategias de transformación que mejoran la posición y la resiliencia en mercados de recursos e industria. La época no es una excusa para vender tecnología. El trabajo es la estrategia y el cambio mismo.",
      },
      bullets: [
        { en: "Business architectures that can last", es: "Arquitecturas de negocio que pueden durar" },
        { en: "Enterprise transformations with a named owner", es: "Transformaciones de la empresa con un responsable nombrado" },
        { en: "Capability building", es: "Construcción de capacidades" },
        { en: "Cultural change that operations will recognize", es: "Un cambio cultural que la operación pueda reconocer" },
      ],
      cta: { en: "Book a Strategy Meeting", es: "Reservar una reunión de estrategia" },
    },
    {
      id: "market-intelligence",
      title: { en: "Market Intelligence & Growth", es: "Inteligencia de mercado y crecimiento" },
      tagline: { en: "Where the opening actually is.", es: "Dónde está de verdad la apertura." },
      hover: {
        en: "Market reading, competitive intelligence, and a growth path across geographies. Advisory, including market intelligence — not a trading screen.",
        es: "Lectura de mercado, inteligencia competitiva y una ruta de crecimiento entre geografías. Asesoría, incluida la inteligencia de mercado, no una pantalla de trading.",
      },
      body: {
        en: "Through market analysis, competitive intelligence, and a forward view, we identify opportunities in natural resources and the industries around them. Decisions on expansion are taken with the downside in writing.",
        es: "Mediante análisis de mercado, inteligencia competitiva y una vista hacia adelante, identificamos oportunidades en recursos naturales y en las industrias que los rodean. Las decisiones de expansión se toman con el escenario adverso por escrito.",
      },
      bullets: [
        { en: "Market and competitive intelligence advisory", es: "Asesoría de inteligencia de mercado y competitiva" },
        { en: "Growth options across geographies", es: "Opciones de crecimiento entre geografías" },
        { en: "Entry and expansion sequencing", es: "Secuencia de entrada y expansión" },
        { en: "A recommendation tied to return, not to volume of slides", es: "Una recomendación atada al retorno, no al volumen de láminas" },
      ],
      cta: { en: "Commission a Market Reading", es: "Encargar una lectura de mercado" },
    },
    {
      id: "partnerships",
      title: { en: "M&A & Strategic Partnerships", es: "M&A y alianzas estratégicas" },
      tagline: { en: "Synergy, named and governed.", es: "Sinergia, nombrada y gobernada." },
      hover: {
        en: "From the target to life after the combination: alliances, ventures, and acquisitions with the risk in view.",
        es: "Del objetivo a la vida después de la combinación: alianzas, empresas conjuntas y adquisiciones con el riesgo a la vista.",
      },
      body: {
        en: "We structure and help negotiate alliances, joint ventures, and acquisitions that unlock value in resource markets. Integration is part of the advice, not a footnote after the toast.",
        es: "Estructuramos y ayudamos a negociar alianzas, empresas conjuntas y adquisiciones que liberan valor en mercados de recursos. La integración es parte del consejo, no una nota al pie después del brindis.",
      },
      bullets: [
        { en: "Target and partner identification", es: "Identificación de objetivos y socios" },
        { en: "Negotiation support", es: "Apoyo en la negociación" },
        { en: "Synergy that can be tracked", es: "Sinergia que se puede seguir" },
        { en: "Post-agreement integration counsel", es: "Consejo de integración después del acuerdo" },
      ],
      cta: { en: "Structure a Partnership", es: "Estructurar una alianza" },
    },
    {
      id: "energy-industrial",
      title: { en: "Energy & Industrial Strategy", es: "Estrategia energética e industrial" },
      tagline: { en: "Performance and a longer horizon.", es: "Desempeño y un horizonte más largo." },
      hover: {
        en: "From upstream to downstream, from hydrocarbons to renewables: strategies that hold operating performance and a sustainability objective in the same plan.",
        es: "Del upstream al downstream, de los hidrocarburos a las renovables: estrategias que sostienen el desempeño operativo y un objetivo de sostenibilidad en el mismo plan.",
      },
      body: {
        en: "Energy and industrial companies are being rewritten by decarbonization and by capital that asks harder questions. We help them plan the transition, judge renewable options, optimize assets, and draw an industrial decarbonization path. Advice, not operations.",
        es: "Las compañías de energía e industria están siendo reescritas por la descarbonización y por un capital que hace preguntas más duras. Les ayudamos a planear la transición, juzgar opciones renovables, optimizar activos y trazar una ruta de descarbonización industrial. Consejo, no operación.",
      },
      bullets: [
        { en: "Energy-transition planning", es: "Planeación de la transición energética" },
        { en: "Renewable strategy", es: "Estrategia renovable" },
        { en: "Asset optimization", es: "Optimización de activos" },
        { en: "Industrial decarbonization roadmaps", es: "Hojas de ruta de descarbonización industrial" },
      ],
      cta: { en: "Explore Energy Strategy", es: "Explorar la estrategia energética" },
    },
    {
      id: "sustainability-advisory",
      title: { en: "Sustainability & Energy Transition Advisory", es: "Asesoría en sostenibilidad y transición energética" },
      tagline: { en: "Profitable, and able to explain why.", es: "Rentable, y capaz de explicar por qué." },
      hover: {
        en: "Sustainability as a source of discipline, cost, and differentiation — a business that can remain profitable and responsible.",
        es: "La sostenibilidad como fuente de disciplina, de costo y de diferenciación: un negocio que puede seguir siendo rentable y responsable.",
      },
      body: {
        en: "Sustainability now sits inside regulation, investor expectation, and customer loyalty. We help enterprises move toward net-zero without abandoning operating performance.",
        es: "La sostenibilidad ya está dentro de la regulación, de la expectativa del inversionista y de la lealtad del cliente. Ayudamos a las empresas a avanzar hacia el cero neto sin abandonar el desempeño operativo.",
      },
      bullets: [
        { en: "Net-zero strategy", es: "Estrategia de cero neto" },
        { en: "ESG framework implementation advice", es: "Asesoría para implementar un marco ESG" },
        { en: "Circular economy models", es: "Modelos de economía circular" },
        { en: "Climate risk assessment", es: "Evaluación de riesgo climático" },
      ],
      cta: { en: "Start the Sustainability Work", es: "Iniciar el trabajo de sostenibilidad" },
    },
    {
      id: "lean",
      title: { en: "Process Optimization & Lean Operations", es: "Optimización de procesos y operaciones lean" },
      tagline: { en: "Less waste. A clearer flow.", es: "Menos desperdicio. Un flujo más claro." },
      hover: {
        en: "We work beside the teams who will keep the gain: lean methods, capability, and a habit of improvement that outlasts the engagement.",
        es: "Trabajamos junto a los equipos que van a conservar la mejora: métodos lean, capacidad y un hábito de mejora que dura más que el encargo.",
      },
      body: {
        en: "We redesign end-to-end processes with Lean, Six Sigma, and constraint thinking, especially where energy and industrial operations lose time and material. The point is a leaner flow, not a layer of software.",
        es: "Rediseñamos procesos de extremo a extremo con Lean, Six Sigma y pensamiento de restricciones, sobre todo donde las operaciones de energía e industria pierden tiempo y material. El punto es un flujo más limpio, no una capa de software.",
      },
      bullets: [
        { en: "Lean redesign and value-stream mapping", es: "Rediseño lean y mapa de cadena de valor" },
        { en: "Six Sigma work on quality", es: "Trabajo Six Sigma sobre calidad" },
        { en: "Bottlenecks and capacity", es: "Cuellos de botella y capacidad" },
        { en: "Standard work people will actually use", es: "Trabajo estándar que la gente usará de verdad" },
      ],
      cta: { en: "Optimize Operations", es: "Optimizar la operación" },
    },
    {
      id: "supply-assets",
      title: { en: "Supply Chain & Asset Management", es: "Cadena de suministro y gestión de activos" },
      tagline: { en: "Flow, inventory, and the life of the asset.", es: "Flujo, inventario y la vida del activo." },
      hover: {
        en: "Logistics, inventory, suppliers, and asset reliability, treated as one system rather than four reports.",
        es: "Logística, inventario, proveedores y confiabilidad de activos, tratados como un solo sistema y no como cuatro reportes.",
      },
      body: {
        en: "We advise on supply networks, sales and operations planning, working capital tied up in inventory, and the care of assets over their life — including maintenance strategy and spare parts. The client runs the chain. We help it see.",
        es: "Asesoramos redes de suministro, la planeación de ventas y operaciones, el capital de trabajo atrapado en inventario y el cuidado de los activos a lo largo de su vida, incluida la estrategia de mantenimiento y los repuestos. El cliente opera la cadena. Nosotros le ayudamos a verla.",
      },
      bullets: [
        { en: "Network design and S&OP", es: "Diseño de red y S&OP" },
        { en: "Inventory and working capital", es: "Inventario y capital de trabajo" },
        { en: "Asset performance and maintenance strategy", es: "Desempeño de activos y estrategia de mantenimiento" },
        { en: "Spare-parts and MRO logic", es: "Lógica de repuestos y MRO" },
      ],
      cta: { en: "Optimize the Supply Chain", es: "Optimizar la cadena de suministro" },
    },
    {
      id: "kpis",
      title: { en: "Performance Management & KPIs", es: "Gestión del desempeño e indicadores" },
      tagline: { en: "What is measured is what gets tended.", es: "Lo que se mide es lo que se cuida." },
      hover: {
        en: "A small set of indicators, a cadence, and incentives that point at the strategy rather than at the noise.",
        es: "Un conjunto breve de indicadores, un ritmo e incentivos que apuntan a la estrategia y no al ruido.",
      },
      body: {
        en: "We help design the performance architecture: which indicators matter, how they cascade, and how management reviews them. The deliverable is a way of managing. It is not a dashboard product.",
        es: "Ayudamos a diseñar la arquitectura del desempeño: qué indicadores importan, cómo se despliegan y cómo la dirección los revisa. El entregable es una forma de gestionar. No es un producto de tableros.",
      },
      bullets: [
        { en: "Indicator architecture", es: "Arquitectura de indicadores" },
        { en: "Review cadence and management reporting", es: "Ritmo de revisión y reportería de gestión" },
        { en: "Scorecards and objectives that fit the business", es: "Tableros de mando y objetivos que encajan con el negocio" },
        { en: "Incentives aligned to the few numbers that matter", es: "Incentivos alineados a los pocos números que importan" },
      ],
      cta: { en: "Build the Performance System", es: "Construir el sistema de desempeño" },
    },
    {
      id: "risk-compliance",
      title: { en: "Operational Risk & Compliance", es: "Riesgo operativo y cumplimiento" },
      tagline: { en: "Safety, quality, and the environmental standard.", es: "Seguridad, calidad y el estándar ambiental." },
      hover: {
        en: "Risk inside the daily work: safety culture, quality, and readiness for environmental and occupational standards, including ISO 14001 and ISO 45001.",
        es: "El riesgo dentro del trabajo diario: cultura de seguridad, calidad y preparación frente a estándares ambientales y ocupacionales, incluidas ISO 14001 e ISO 45001.",
      },
      body: {
        en: "Safety incidents, quality failures, and regulatory misses are financial events. We help build risk frameworks, safety culture, quality systems, and compliance readiness — including environmental management aligned with ISO 14001 and occupational health and safety aligned with ISO 45001. We advise on the system. We are not the certifying body, and we do not claim those certificates for Zoharav.",
        es: "Los incidentes de seguridad, las fallas de calidad y los incumplimientos regulatorios son hechos financieros. Ayudamos a construir marcos de riesgo, cultura de seguridad, sistemas de calidad y preparación para el cumplimiento, incluida la gestión ambiental alineada con ISO 14001 y la seguridad y salud en el trabajo alineada con ISO 45001. Asesoramos el sistema. No somos el organismo certificador y no reclamamos esos certificados para Zoharav.",
      },
      bullets: [
        { en: "Operational risk assessment", es: "Evaluación de riesgo operativo" },
        { en: "Safety management and culture", es: "Gestión y cultura de seguridad" },
        { en: "Quality systems", es: "Sistemas de calidad" },
        { en: "ISO 14001 and ISO 45001 readiness — advisory, not certification", es: "Preparación para ISO 14001 e ISO 45001: asesoría, no certificación" },
      ],
      cta: { en: "Strengthen Risk Management", es: "Fortalecer la gestión de riesgo" },
    },
  ],
};
