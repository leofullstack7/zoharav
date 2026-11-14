/** Small localized-copy helpers for the Octano chat widget, kept separate
 * from the component so the strings are easy to scan/review on their own. */

import { loc } from "@/lib/i18n/loc";

export function greeting(locale: string, botName: string): string {
  if (locale === "es") {
    return `Hola, soy ${botName}. Cuéntame qué tienes en mente y te oriento. Si hace falta, te conecto con un asesor senior.`;
  }
  if (locale === "ar") {
    return `مرحبًا، أنا ${botName}. أخبرني بما يدور في ذهنك وسأرشدك. عند الحاجة، أوصلك بمستشار أول.`;
  }
  return `Hi, I'm ${botName}. Tell me what's on your mind and I'll help point you in the right direction. If it calls for it, I'll connect you with a senior advisor.`;
}

export function followUpMessage(locale: string, serviceName: string): string {
  if (locale === "es") {
    return `Nuestro equipo de profesionales se encargará de brindarte una consulta especializada sobre ${serviceName}. ¿Deseas revisar la agenda disponible?`;
  }
  if (locale === "ar") {
    return `سيتولى فريقنا من المختصين تقديم استشارة متخصصة حول ${serviceName}. هل ترغب في مراجعة المواعيد المتاحة؟`;
  }
  return `Our team of specialists will take care of giving you a specialized consultation on ${serviceName}. Would you like to check the available schedule?`;
}

export function genericErrorText(locale: string): string {
  return loc(
    {
      en: "I couldn't send your message just now. Could you try again?",
      es: "No pude enviar tu mensaje justo ahora. ¿Puedes intentarlo de nuevo?",
    },
    locale,
  );
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
  return loc(dict, locale);
}
