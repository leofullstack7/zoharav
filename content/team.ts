export type TeamMember = {
  id: string;
  /** Empty string for reserved/placeholder seats — never a fabricated person. */
  name: string;
  role: { en: string; es: string };
  image: string;
  /** Optional until the client provides a biography. */
  bio?: { en: string; es: string };
  /** Optional. Hidden when empty. */
  linkedin?: string;
  /**
   * True for seats reserved for advisors who have not joined yet (or whose
   * photo/bio has not been supplied). Rendered with the firm monogram
   * instead of initials, and a generic "Open Seat" label instead of a name —
   * never a stand-in person.
   */
  placeholder?: boolean;
};

/**
 * Ten seats total: three confirmed members today, seven reserved seats so
 * the team slider reads as a full desk while the firm fills the remaining
 * roles. Swap a reserved seat's `name`, `image`, and `placeholder: false`
 * in place — no component changes required.
 *
 * No photography exists yet for anyone below (see TeamSlider, which renders
 * a CSS monogram/initials tile for every seat rather than pointing at an
 * image file that doesn't exist on disk).
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
    id: "leandro-garces",
    name: "Leandro Garcés",
    // NOTE: previously "Chief Technology & Systems Officer", a holdover from
    // the firm's earlier technology-vendor positioning. Retitled to a
    // sector-neutral operating role that fits an advisory firm. Flagged for
    // owner review — swap for the preferred title at any time.
    role: {
      en: "Chief Operating Officer",
      es: "Director de operaciones",
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
  {
    id: "seat-oil-energy",
    name: "",
    role: {
      en: "Senior Advisor, Oil & Energy",
      es: "Asesor senior, Petróleo y energía",
    },
    image: "/images/team/seat-oil-energy.jpg",
    placeholder: true,
  },
  {
    id: "seat-mining",
    name: "",
    role: {
      en: "Senior Advisor, Mining & Natural Resources",
      es: "Asesor senior, Minería y recursos naturales",
    },
    image: "/images/team/seat-mining.jpg",
    placeholder: true,
  },
  {
    id: "seat-sustainability",
    name: "",
    role: {
      en: "Senior Advisor, Sustainability & ESG",
      es: "Asesor senior, Sostenibilidad y ESG",
    },
    image: "/images/team/seat-sustainability.jpg",
    placeholder: true,
  },
  {
    id: "seat-investment",
    name: "",
    role: {
      en: "Senior Advisor, Investment & Financial Advisory",
      es: "Asesor senior, Inversión y asesoría financiera",
    },
    image: "/images/team/seat-investment.jpg",
    placeholder: true,
  },
  {
    id: "seat-strategy",
    name: "",
    role: {
      en: "Senior Advisor, Strategic & Operational Consulting",
      es: "Asesor senior, Consultoría estratégica y operativa",
    },
    image: "/images/team/seat-strategy.jpg",
    placeholder: true,
  },
  {
    id: "seat-presence-miami",
    name: "",
    role: {
      en: "Senior Advisor, Miami Desk",
      es: "Asesor senior, Mesa Miami",
    },
    image: "/images/team/seat-presence-miami.jpg",
    placeholder: true,
  },
  {
    id: "seat-presence-puerto-rico",
    name: "",
    role: {
      en: "Senior Advisor, Puerto Rico Desk",
      es: "Asesor senior, Mesa Puerto Rico",
    },
    image: "/images/team/seat-presence-puerto-rico.jpg",
    placeholder: true,
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
