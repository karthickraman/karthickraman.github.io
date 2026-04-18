"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const links = [
  { id: "whoami", label: "whoami" },
  { id: "about", label: "man about" },
  { id: "skills", label: "tree skills" },
  { id: "experience", label: "git log" },
  { id: "projects", label: "ls projects" },
  { id: "contact", label: "contact" },
] as const;

export function Navbar() {
  const [active, setActive] = useState("whoami");

  useEffect(() => {
    let raf = 0;
    const ids = links.map((l) => l.id);

    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let next = "whoami";
        for (let i = ids.length - 1; i >= 0; i--) {
          const el = document.getElementById(ids[i]);
          if (el && el.getBoundingClientRect().top <= 120) {
            next = ids[i];
            break;
          }
        }
        setActive((prev) => (prev === next ? prev : next));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = useCallback((id: string) => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass sticky top-0 z-50 border-b border-terminal-border/60"
    >
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="mb-2.5 flex items-center gap-2 text-xs text-terminal-muted">
          <span className="text-terminal-accent text-glow">$</span>
          <span className="truncate text-terminal-body/80">
            exec portfolio-nav
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-accent animate-pulse" />
            <span className="text-terminal-accent/60 text-[10px]">
              session active
            </span>
          </span>
        </div>
        <nav
          className="cmd-scroll flex gap-1.5 overflow-x-auto pb-1"
          aria-label="Primary"
        >
          {links.map((link, i) => (
            <motion.button
              key={link.id}
              type="button"
              onClick={() => scrollTo(link.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
              aria-current={active === link.id ? "true" : undefined}
              className={`min-h-11 shrink-0 rounded-md border px-3 py-2 text-left text-xs transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent ${
                active === link.id
                  ? "nav-active"
                  : "border-terminal-border bg-terminal-surface/60 text-terminal-muted hover:border-terminal-accent/40 hover:bg-terminal-surface hover:text-terminal-accent-soft"
              }`}
            >
              <span className="text-terminal-muted/50">$</span> {link.label}
            </motion.button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
