/** Small localized-copy helpers for the Octano chat widget, kept separate
 * from the component so the strings are easy to scan/review on their own. */

export function greeting(locale: string, botName: string): string {
  return locale === "es"
    ? `Hola, soy ${botName}. Cuéntame qué tienes en mente y te oriento. Si hace falta, te conecto con un asesor senior.`
    : `Hi, I'm ${botName}. Tell me what's on your mind and I'll help point you in the right direction. If it calls for it, I'll connect you with a senior advisor.`;
}

export function followUpMessage(locale: string, serviceName: string): string {
  return locale === "es"
    ? `Nuestro equipo de profesionales se encargará de brindarte una consulta especializada sobre ${serviceName}. ¿Deseas revisar la agenda disponible?`
    : `Our team of specialists will take care of giving you a specialized consultation on ${serviceName}. Would you like to check the available schedule?`;
}

export function genericErrorText(locale: string): string {
  return locale === "es"
    ? "No pude enviar tu mensaje justo ahora. ¿Puedes intentarlo de nuevo?"
    : "I couldn't send your message just now. Could you try again?";
}

export const uiText = {
  panelTitle: { en: "Octano", es: "Octano" },
  conciergeKicker: { en: "Private Concierge", es: "Concierge privado" },
  inputPlaceholder: {
    en: "Write your message…",
    es: "Escribe tu mensaje…",
  },
  send: { en: "Send", es: "Enviar" },
  sending: { en: "Sending…", es: "Enviando…" },
  seeMore: { en: "See more", es: "Ver más" },
  yes: { en: "Yes", es: "Sí" },
  no: { en: "No", es: "No" },
  close: { en: "Close chat", es: "Cerrar chat" },
  bookSession: { en: "Book the session", es: "Reservar la sesión" },
  theOffices: { en: "The offices", es: "Las oficinas" },
  loadingBot: { en: "Connecting…", es: "Conectando…" },
};

export function t(dict: { en: string; es: string }, locale: string): string {
  return locale === "es" ? dict.es : dict.en;
}
