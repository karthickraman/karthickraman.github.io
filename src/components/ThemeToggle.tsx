"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi2";
import {
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "@/lib/theme";

function readTheme(): ThemeMode {
  const v = document.documentElement.getAttribute("data-theme");
  return v === "light" ? "light" : "dark";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode / blocked storage */
  }
  const meta = document.getElementById("theme-color-meta");
  if (meta) {
    meta.setAttribute(
      "content",
      theme === "light" ? THEME_COLOR_LIGHT : THEME_COLOR_DARK,
    );
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode | null>(null);

  useLayoutEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const current = prev ?? readTheme();
      const next: ThemeMode = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const resolved = theme ?? "dark";
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-terminal-border bg-terminal-surface/60 text-terminal-muted transition hover:border-terminal-accent/40 hover:bg-terminal-surface hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <HiSun className="h-[18px] w-[18px]" aria-hidden />
      ) : (
        <HiMoon className="h-[18px] w-[18px]" aria-hidden />
      )}
    </button>
  );
}
