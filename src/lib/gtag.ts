/** GA4 Measurement ID from build env (safe to expose in the browser bundle). */
export const GA_MEASUREMENT_ID =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : "";

export function hasGa(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Send SPA / client navigation page views to GA4. */
export function sendPageView(fullPath: string): void {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: fullPath,
    send_page_view: true,
  });
}
