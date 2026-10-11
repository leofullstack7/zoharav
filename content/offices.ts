export type Office = {
  id: "medellin" | "miami" | "puerto-rico" | "dubai";
  city: { en: string; es: string };
  role: { en: string; es: string };
  /** TODO addresses stay empty in the UI until the client confirms them. */
  address: string;
  addressTodo?: boolean;
  timezone: string;
  timezoneLabel: string;
  hours: { en: string; es: string };
  active: boolean;
  image: string;
};

export const offices: Office[] = [
  {
    id: "medellin",
    city: { en: "Medellín", es: "Medellín" },
    role: { en: "Latin America Hub", es: "Hub de América Latina" },
    // TODO: client to confirm the Medellín street address.
    address: "",
    addressTodo: true,
    timezone: "America/Bogota",
    timezoneLabel: "COT (UTC-5)",
    hours: { en: "", es: "" },
    active: true,
    image: "/images/offices/medellin.jpg",
  },
  {
    id: "miami",
    city: { en: "Miami", es: "Miami" },
    role: { en: "Global Markets", es: "Mercados globales" },
    address: "Brickell City Center, 701 S Miami Ave, Miami, FL 33131",
    timezone: "America/New_York",
    timezoneLabel: "EST (UTC-5)",
    hours: {
      en: "Monday – Thursday: 8:00 AM – 5:00 PM · Friday: 8:00 AM – 2:00 PM · Saturday–Sunday: Closed",
      es: "Lunes a jueves: 8:00 a. m. – 5:00 p. m. · Viernes: 8:00 a. m. – 2:00 p. m. · Sábado y domingo: cerrado",
    },
    active: true,
    image: "/images/offices/miami.jpg",
  },
  {
    id: "puerto-rico",
    city: { en: "Puerto Rico", es: "Puerto Rico" },
    role: { en: "Caribbean Gateway", es: "Puerta del Caribe" },
    address: "103 Avenida José de Diego, Gallery Plaza, San Juan, PR 00911",
    timezone: "America/Puerto_Rico",
    timezoneLabel: "AST (UTC-4)",
    hours: {
      en: "Monday – Thursday: 8:00 AM – 5:00 PM · Friday: 8:00 AM – 2:00 PM · Saturday–Sunday: Closed",
      es: "Lunes a jueves: 8:00 a. m. – 5:00 p. m. · Viernes: 8:00 a. m. – 2:00 p. m. · Sábado y domingo: cerrado",
    },
    active: true,
    image: "/images/offices/san-juan.jpg",
  },
  {
    id: "dubai",
    city: { en: "Dubai", es: "Dubái" },
    role: { en: "Middle East", es: "Medio Oriente" },
    address: "18th Floor, Marina Plaza, Dubai Marina, UAE",
    timezone: "Asia/Dubai",
    timezoneLabel: "GST (UTC+4)",
    hours: {
      en: "Sunday – Thursday: 9:00 AM – 6:00 PM · Friday–Saturday: Closed",
      es: "Domingo a jueves: 9:00 a. m. – 6:00 p. m. · Viernes y sábado: cerrado",
    },
    // Editable: set active to true only after the client confirms the office.
    active: false,
    image: "/images/offices/dubai.jpg",
  },
];

export const activeOffices = offices.filter((office) => office.active);
