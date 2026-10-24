import type { Localized } from "./types";

export const hero = {
  eyebrow: {
    en: "Resources Today. A Stronger Tomorrow.",
    es: "Recursos hoy. Un mañana más sólido.",
  } satisfies Localized,
  titleGold: {
    en: "Natural Resources.",
    es: "Recursos naturales.",
  } satisfies Localized,
  titleRotating: [
    { en: "Global Impact.", es: "Impacto global." },
    { en: "Real Impact.", es: "Impacto real." },
    { en: "A Stronger Tomorrow.", es: "Un mañana más sólido." },
  ] satisfies Localized[],
  subtitle: {
    en: "Strategic advisory in Oil & Energy, Mining and Natural Resources. Connecting capital, expertise and opportunities across the globe.",
    es: "Asesoría estratégica en petróleo y energía, minería y recursos naturales. Conectamos capital, criterio y oportunidades en el mundo.",
  } satisfies Localized,
  mobileTitle: {
    en: "Connecting Natural Wealth with a Stronger Tomorrow.",
    es: "Conectamos la riqueza natural con un mañana más sólido.",
  } satisfies Localized,
};

export type BannerId = "mandato" | "horizonte" | "presencia";

export const bannerOptions: { id: BannerId; label: Localized }[] = [
  { id: "mandato", label: { en: "Mandate", es: "Mandato" } },
  { id: "horizonte", label: { en: "Horizon", es: "Horizonte" } },
  { id: "presencia", label: { en: "Presence", es: "Presencia" } },
];

export const banners: Record<
  BannerId,
  { eyebrow: Localized; title: Localized; lede: Localized }
> = {
  mandato: {
    eyebrow: {
      en: "Counsel for the person who signs",
      es: "Consejo para quien firma",
    },
    title: {
      en: "A decision a board can sign.",
      es: "Una decisión que un directorio puede firmar.",
    },
    lede: {
      en: "We read the market, structure the opportunity, and stay through the close. We advise on the resource. We do not operate it.",
      es: "Leemos el mercado, estructuramos la oportunidad y nos quedamos hasta el cierre. Asesoramos el recurso. No lo operamos.",
    },
  },
  horizonte: {
    eyebrow: {
      en: "After the resource, the decision.",
      es: "Después del recurso, la decisión.",
    },
    title: {
      en: "What still holds in ten years.",
      es: "Lo que sigue en pie dentro de diez años.",
    },
    lede: {
      en: "Oil, minerals, and the capital that moves them. The work is the judgment behind the transaction, not the commodity itself.",
      es: "Petróleo, minerales y el capital que los mueve. El trabajo es el juicio detrás de la transacción, no la materia prima.",
    },
  },
  presencia: {
    eyebrow: {
      en: "Three rooms. One judgment.",
      es: "Tres mesas. Un criterio.",
    },
    title: {
      en: "Medellín. Miami. Puerto Rico.",
      es: "Medellín. Miami. Puerto Rico.",
    },
    lede: {
      en: "A mandate can start in Latin America and close with a partner who is already in the room in Miami or the Caribbean.",
      es: "Un mandato puede empezar en América Latina y cerrarse con un socio que ya está en la mesa en Miami o en el Caribe.",
    },
  },
};

export const trust = [
  {
    id: "room",
    title: { en: "Who is in the room", es: "Quién está en la sala" },
    body: {
      en: "Senior consultants, more than 15 years in leading global firms, former Fortune 500 executives, and specialists who hold PMP and CFA credentials.",
      es: "Consultores senior, más de 15 años en firmas globales de primer nivel, exejecutivos de compañías Fortune 500 y especialistas con PMP y CFA.",
    },
    href: "/about",
    cta: { en: "The firm", es: "La firma" },
  },
  {
    id: "limit",
    title: { en: "The line we do not cross", es: "La línea que no cruzamos" },
    body: {
      en: "We do not sell, transport, or operate oil, gas, or minerals. The mandate is counsel. That boundary is how a board knows what it is buying.",
      es: "No vendemos, transportamos ni operamos petróleo, gas o minerales. El mandato es de consejo. Ese límite es lo que un directorio sabe que está comprando.",
    },
    href: "/faq",
    cta: { en: "The boundary", es: "El límite" },
  },
  {
    id: "start",
    title: { en: "How a mandate starts", es: "Cómo empieza un mandato" },
    body: {
      en: "Sixty minutes with a senior advisor. The USD 500 reservation is credited to the engagement if you continue.",
      es: "Sesenta minutos con un asesor senior. La reserva de USD 500 se acredita al encargo si deciden continuar.",
    },
    href: "/booking",
    cta: { en: "Reserve the session", es: "Reservar la sesión" },
  },
] as const;

export const chapters = {
  bridge: {
    quote: {
      en: "Bridging opportunities across continents.",
      es: "Tendemos oportunidades entre continentes.",
    } satisfies Localized,
  },
  firm: {
    number: "01",
    title: { en: "Our Firm", es: "La firma" } satisfies Localized,
    subtitle: {
      en: "Experience. Connections. Results.",
      es: "Experiencia. Relaciones. Resultados.",
    } satisfies Localized,
    lead: {
      en: "ZOHARAV & CO. is a global consulting and investment advisory firm specialized in the oil & energy, mining, and natural resources sectors. We connect capital, expertise, and opportunities to create sustainable value across borders.",
      es: "ZOHARAV & CO. es una firma global de consultoría y asesoría de inversión, especializada en petróleo y energía, minería y recursos naturales. Conectamos capital, criterio y oportunidades para crear valor sostenible a través de las fronteras.",
    } satisfies Localized,
    body: {
      en: "Recognizing that every business faces its own set of needs and challenges, our focus is on counsel shaped to growth, resilience, and the responsible development of natural resources. We do not just provide advice, we deliver results. In the energy industry and beyond, we help organizations read the market, structure the opportunity, and carry a decision through.",
      es: "Sabemos que cada empresa enfrenta necesidades y tensiones propias. Nuestro foco es un consejo ajustado al crecimiento, a la resiliencia y al desarrollo responsable de los recursos naturales. No nos limitamos a aconsejar: entregamos resultados. En la industria energética y más allá, ayudamos a leer el mercado, estructurar la oportunidad y llevar una decisión hasta el final.",
    } satisfies Localized,
    points: [
      { en: "Global Vision", es: "Visión global" },
      { en: "Strategic Partnerships", es: "Alianzas estratégicas" },
      { en: "Disciplined Execution", es: "Ejecución disciplinada" },
      { en: "Lasting Value", es: "Valor duradero" },
    ] satisfies Localized[],
    signature: "Global Expertise, Local Impact",
    vertical: {
      en: "Strategy. Capital. Expertise. Real Impact.",
      es: "Estrategia. Capital. Criterio. Impacto real.",
    } satisfies Localized,
  },
  oil: {
    number: "03",
    title: { en: "Oil & Energy", es: "Petróleo y energía" } satisfies Localized,
    subtitle: {
      en: "Powering Opportunities. Fueling Progress.",
      es: "Impulsar oportunidades. Sostener el progreso.",
    } satisfies Localized,
    body: {
      en: "We provide advisory and consulting services across the energy value chain, including exploration and production strategy, infrastructure, and renewable transition projects. We advise companies that operate. We do not explore, produce, refine, sell, or transport oil or gas.",
      es: "Prestamos asesoría y consultoría a lo largo de la cadena energética, incluida la estrategia de exploración y producción, la infraestructura y los proyectos de transición renovable. Asesoramos a las compañías que operan. No exploramos, producimos, refinamos, vendemos ni transportamos petróleo o gas.",
    } satisfies Localized,
    bullets: [
      { en: "Exploration & Production Advisory", es: "Asesoría en exploración y producción" },
      { en: "Infrastructure & Logistics", es: "Infraestructura y logística" },
      { en: "Regulatory & Government Relations", es: "Regulación y relaciones con gobiernos" },
      { en: "Energy Transition & Renewables", es: "Transición energética y renovables" },
    ] satisfies Localized[],
  },
  mining: {
    number: "04",
    title: { en: "Mining", es: "Minería" } satisfies Localized,
    subtitle: {
      en: "Precious Resources. Strategic Value.",
      es: "Recursos preciosos. Valor estratégico.",
    } satisfies Localized,
    body: {
      en: "We specialize in the development and investment advisory of high-value mineral assets, including gold, emeralds, and strategic minerals. The work covers diligence, responsible practice, and the structure of capital. We do not mine, buy, or sell the minerals.",
      es: "Nos especializamos en la asesoría de desarrollo e inversión de activos minerales de alto valor, incluidos el oro, las esmeraldas y los minerales estratégicos. El trabajo cubre la debida diligencia, la práctica responsable y la estructura del capital. No extraemos, compramos ni vendemos los minerales.",
    } satisfies Localized,
    bullets: [
      { en: "Gold & Precious Metals", es: "Oro y metales preciosos" },
      { en: "Emeralds & Gemstones", es: "Esmeraldas y gemas" },
      { en: "Exploration & Development Advisory", es: "Asesoría en exploración y desarrollo" },
      { en: "Sustainable Mining Practices", es: "Prácticas mineras sostenibles" },
      { en: "Market Access & Global Trade Advisory", es: "Asesoría de acceso a mercado y comercio global" },
    ] satisfies Localized[],
  },
  presence: {
    number: "05",
    title: { en: "Global Presence", es: "Presencia global" } satisfies Localized,
    subtitle: {
      en: "Three Strategic Hubs. A World of Opportunities.",
      es: "Tres hubs estratégicos. Un mundo de oportunidades.",
    } satisfies Localized,
    body: {
      en: "Our presence in Medellín, Miami and Puerto Rico allows us to bridge Latin America with global markets, offering a clear path to opportunities and partnerships.",
      es: "Nuestra presencia en Medellín, Miami y Puerto Rico nos permite unir América Latina con los mercados globales, con un camino claro hacia oportunidades y alianzas.",
    } satisfies Localized,
  },
  sustainability: {
    number: "06",
    title: { en: "Sustainability", es: "Sostenibilidad" } satisfies Localized,
    subtitle: {
      en: "Responsible Development for Future Generations.",
      es: "Desarrollo responsable para las próximas generaciones.",
    } satisfies Localized,
    body: {
      en: "We are committed to responsible resource development, environmental stewardship, and creating long-term value for communities and investors.",
      es: "Estamos comprometidos con el desarrollo responsable de los recursos, el cuidado del entorno y la creación de valor de largo plazo para comunidades e inversionistas.",
    } satisfies Localized,
    pillars: [
      { en: "Environmental Stewardship", es: "Cuidado ambiental" },
      { en: "Community Development", es: "Desarrollo de comunidades" },
      { en: "Ethical Practices", es: "Prácticas éticas" },
      { en: "Long-Term Value", es: "Valor de largo plazo" },
    ] satisfies Localized[],
  },
  investment: {
    number: "07",
    title: { en: "Investment Opportunities", es: "Oportunidades de inversión" } satisfies Localized,
    subtitle: {
      en: "Turning Natural Wealth into Lasting Value.",
      es: "Convertir la riqueza natural en valor duradero.",
    } satisfies Localized,
    body: {
      en: "We identify, structure, and connect high-potential projects with global investors, governments, and strategic partners. We advise on the transaction. We do not take the resource to market ourselves.",
      es: "Identificamos, estructuramos y conectamos proyectos de alto potencial con inversionistas globales, gobiernos y socios estratégicos. Asesoramos la transacción. No llevamos el recurso al mercado por cuenta propia.",
    } satisfies Localized,
    bullets: [
      { en: "Project Identification", es: "Identificación de proyectos" },
      { en: "Feasibility & Due Diligence", es: "Factibilidad y debida diligencia" },
      { en: "Capital Raising", es: "Levantamiento de capital" },
      { en: "Strategic Partnerships", es: "Alianzas estratégicas" },
      { en: "Long-Term Value Creation", es: "Creación de valor de largo plazo" },
    ] satisfies Localized[],
  },
  contact: {
    number: "08",
    title: { en: "Contact Us", es: "Contacto" } satisfies Localized,
    subtitle: {
      en: "Let's Build What's Next.",
      es: "Construyamos lo que sigue.",
    } satisfies Localized,
    body: {
      en: "We welcome strategic partners, investors, and stakeholders to explore new opportunities together.",
      es: "Recibimos a socios estratégicos, inversionistas y grupos de interés para explorar juntos nuevas oportunidades.",
    } satisfies Localized,
    confirmation: {
      en: "Message us and we'll get back to you.",
      es: "Escríbanos y le responderemos.",
    } satisfies Localized,
  },
};

export const aboutCopy = {
  heroTitle: {
    en: "Empowering Natural Resource Evolution",
    es: "Impulsar la evolución de los recursos naturales",
  } satisfies Localized,
  heroSubtitle: {
    en: "Strategic counsel for a more responsible, connected future.",
    es: "Consejo estratégico para un futuro más responsable y conectado.",
  } satisfies Localized,
  intro: {
    en: "Recognizing that every business faces its own set of needs and challenges, our focus is on providing counsel tailored to growth, resilience, and the responsible development of natural resources. Our goal is to be the strategic ally you need in a market that is being rewritten by climate, capital, and community.",
    es: "Sabemos que cada empresa enfrenta necesidades y tensiones propias. Nuestro foco es un consejo ajustado al crecimiento, a la resiliencia y al desarrollo responsable de los recursos naturales. Queremos ser el aliado estratégico que se necesita en un mercado que el clima, el capital y las comunidades están reescribiendo.",
  } satisfies Localized,
  vision: {
    en: "Our vision is to be the premier partner for organizations seeking integrated, forward-looking counsel in natural resources, energy, and responsible investment. We aspire to lead in each of our advisory lines and to create lasting impact, so that our clients can reach objectives that still hold a generation from now. Sustainable practice and uncompromising judgment are how we intend to get there.",
    es: "Nuestra visión es ser el socio de referencia para las organizaciones que buscan un consejo integrado y de largo plazo en recursos naturales, energía e inversión responsable. Aspiramos a liderar en cada una de nuestras líneas de asesoría y a dejar un impacto que dure, de modo que nuestros clientes alcancen objetivos que sigan en pie dentro de una generación. La práctica sostenible y el juicio exigente son el camino.",
  } satisfies Localized,
  mission: {
    en: "Our mission is to advise companies, investors, and institutions on natural resources, energy, sustainability, and responsible investment. We deliver strategic, financial, and operational counsel that creates value across borders. We do not develop software, sell cybersecurity, trade real estate, or operate energy and mineral assets.",
    es: "Nuestra misión es asesorar a empresas, inversionistas e instituciones en recursos naturales, energía, sostenibilidad e inversión responsable. Entregamos consejo estratégico, financiero y operativo que crea valor a través de las fronteras. No desarrollamos software, no vendemos ciberseguridad, no comercializamos bienes raíces ni operamos activos de energía o minerales.",
  } satisfies Localized,
};

export const supportNetwork = {
  intro: {
    en: "24/7 assistance across five continents, with local judgment in every region we are asked to serve.",
    es: "Acompañamiento continuo en cinco continentes, con criterio local en cada región donde se nos convoca.",
  } satisfies Localized,
  regions: [
    { id: "all", label: { en: "All Regions", es: "Todas las regiones" } },
    { id: "north-america", label: { en: "North America", es: "Norteamérica" } },
    { id: "europe", label: { en: "Europe", es: "Europa" } },
    { id: "asia", label: { en: "Asia", es: "Asia" } },
    { id: "africa", label: { en: "Africa", es: "África" } },
    { id: "oceania", label: { en: "Oceania", es: "Oceanía" } },
    { id: "latin-america", label: { en: "Latin America & Caribbean", es: "Latinoamérica y el Caribe" } },
  ] satisfies { id: string; label: Localized }[],
};

export const timeline = [
  {
    year: "2015",
    title: { en: "Paris Agreement Adopted", es: "Se adopta el Acuerdo de París" },
    body: {
      en: "196 countries commit to limiting global warming to well below 2°C.",
      es: "196 países se comprometen a limitar el calentamiento global muy por debajo de 2 °C.",
    },
  },
  {
    year: "2021",
    title: { en: "Net-Zero Commitments Surge", es: "Se multiplican los compromisos de cero neto" },
    body: {
      en: "Over 130 countries representing 90% of global GDP pledge net-zero targets.",
      es: "Más de 130 países, que representan el 90 % del PIB mundial, anuncian metas de cero neto.",
    },
  },
  {
    year: "2025",
    title: { en: "Renewable Capacity Doubles", es: "La capacidad renovable se duplica" },
    body: {
      en: "Global renewable energy capacity reaches 5,000 GW, doubling from 2020 levels.",
      es: "La capacidad renovable global alcanza 5.000 GW y duplica el nivel de 2020.",
    },
  },
  {
    year: "2030",
    title: { en: "Electric Vehicle Dominance", es: "Los vehículos eléctricos toman la delantera" },
    body: {
      en: "EVs represent 60% of new car sales globally, transforming transportation.",
      es: "Los vehículos eléctricos representan el 60 % de las ventas de autos nuevos en el mundo y transforman el transporte.",
    },
  },
  {
    year: "2050",
    title: { en: "Net-Zero Economy", es: "Economía de cero neto" },
    body: {
      en: "The global economy is aimed at carbon neutrality through renewable energy and carbon capture.",
      es: "La economía global se orienta a la neutralidad de carbono mediante energía renovable y captura de carbono.",
    },
  },
] as const;
