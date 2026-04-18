export const THEME_STORAGE_KEY = "portfolio-theme";

export type ThemeMode = "light" | "dark";

export const THEME_COLOR_DARK = "#0a0e14";
export const THEME_COLOR_LIGHT = "#e9eef5";

/** Runs before paint — keep logic aligned with `applyTheme` in `ThemeToggle`. */
export function themeBootstrapScript(): string {
  const key = JSON.stringify(THEME_STORAGE_KEY);
  const light = JSON.stringify(THEME_COLOR_LIGHT);
  const dark = JSON.stringify(THEME_COLOR_DARK);
  return `(function(){try{var k=${key};var s=localStorage.getItem(k);var d=document.documentElement;var m=s==="light"||s==="dark"?s:window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.setAttribute("data-theme",m);d.style.colorScheme=m;var e=document.getElementById("theme-color-meta");if(e)e.setAttribute("content",m==="light"?${light}:${dark});}catch(a){document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";}})();`;
}
