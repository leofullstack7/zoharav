import type Lenis from "lenis";

declare global {
  interface Window {
    __zoharavLenis?: Lenis;
  }
}

export function setLenisInstance(instance: Lenis | undefined) {
  if (typeof window === "undefined") return;
  window.__zoharavLenis = instance;
}

export function getLenisInstance() {
  if (typeof window === "undefined") return undefined;
  return window.__zoharavLenis;
}

/** Pausa el scroll suave de la página (modales, overlays). */
export function pauseSiteScroll() {
  getLenisInstance()?.stop();
}

export function resumeSiteScroll() {
  getLenisInstance()?.start();
}