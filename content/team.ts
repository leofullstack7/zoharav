export type TeamMember = {
  id: string;
  name: string;
  role: { en: string; es: string };
  image: string;
  /** Optional until the client provides a biography. */
  bio?: { en: string; es: string };
  /** Optional. Hidden when empty. */
  linkedin?: string;
};

/**
 * REVIEW: confirm whether these titles still fit the firm’s repositioning
 * toward natural resources, energy, sustainability, and responsible investment.
 * In particular, “Chief Technology & Systems Officer” comes from the previous site.
 */
export const team: TeamMember[] = [
  {
    id: "d-de-jesus",
    name: "D. De Jesús",
    role: {
      en: "Chief Executive Officer",
      es: "Director general",
    },
    image: "/images/team/d-de-jesus.jpg",
  },
  {
    id: "juan-felipe-grisales",
    name: "Juan Felipe Grisales",
    role: {
      en: "Reservation Agent",
      es: "Agente de reservas",
    },
    image: "/images/team/juan-felipe-grisales.jpg",
  },
  {
    id: "leandro-garces",
    name: "Leandro Garcés",
    role: {
      en: "Chief Technology & Systems Officer",
      es: "Director de tecnología y sistemas",
    },
    image: "/images/team/leandro-garces.jpg",
  },
  {
    id: "andres-pineda",
    name: "Andrés Pineda",
    role: {
      en: "Industrial Engineer | Growth Strategist",
      es: "Ingeniero industrial | Estratega de crecimiento",
    },
    image: "/images/team/andres-pineda.jpg",
  },
];

export const values = [
  {
    id: "integrity",
    title: { en: "Integrity", es: "Integridad" },
    line: {
      en: "Advice that can stand in front of a board, a regulator, and a community.",
      es: "Un consejo que resiste ante un directorio, un regulador y una comunidad.",
    },
  },
  {
    id: "innovation",
    title: { en: "Innovation", es: "Innovación" },
    line: {
      en: "New structures for capital, partnerships, and resource strategy — not technology as a product.",
      es: "Nuevas estructuras de capital, alianzas y estrategia de recursos, no la tecnología como producto.",
    },
  },
  {
    id: "excellence",
    title: { en: "Excellence", es: "Excelencia" },
    line: {
      en: "Work precise enough for a transaction and calm enough for a long cycle.",
      es: "Un trabajo tan preciso como una transacción y tan sereno como un ciclo largo.",
    },
  },
  {
    id: "collaboration",
    title: { en: "Global Collaboration", es: "Colaboración global" },
    line: {
      en: "Medellín, Miami, and Puerto Rico, working as one desk for cross-border mandates.",
      es: "Medellín, Miami y Puerto Rico, como una sola mesa para mandatos transfronterizos.",
    },
  },
  {
    id: "sustainability",
    title: { en: "Sustainability", es: "Sostenibilidad" },
    line: {
      en: "Long-term value for investors, communities, and the places resources come from.",
      es: "Valor de largo plazo para inversionistas, comunidades y los territorios de donde vienen los recursos.",
    },
  },
] as const;

/** Credentials carried from the firm FAQ. Cyber and cloud certificates are intentionally absent. */
export const credentials = {
  en: "Our team is composed of senior consultants with an average of over 15 years of experience in top-tier global firms, former Fortune 500 executives, and specialists with international certifications in their respective areas (PMP, CFA, among others). We combine sector judgment with strategic discipline, and we execute work that is meant to last.",
  es: "Nuestro equipo está formado por consultores senior con un promedio de más de 15 años de experiencia en firmas globales de primer nivel, exejecutivos de compañías Fortune 500 y especialistas con certificaciones internacionales en sus campos (PMP, CFA, entre otras). Unimos criterio de sector y disciplina estratégica, y ejecutamos un trabajo pensado para durar.",
};
