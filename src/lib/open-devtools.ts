/** Dispatched on `window` so any component can open the global DevTools panel. */
export const OPEN_DEVTOOLS_EVENT = "portfolio:devtools-open";

export function openDevTools(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_DEVTOOLS_EVENT));
}
