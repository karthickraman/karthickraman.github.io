"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const links = [
  { id: "hero", label: "~/hero" },
  { id: "about", label: "man about" },
  { id: "skills", label: "tree skills" },
  { id: "experience", label: "git log" },
  { id: "projects", label: "ls projects" },
  { id: "contact", label: "./contact" },
] as const;

export function Navbar() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const ids = links.map((l) => l.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(ids[i]);
          return;
        }
      }
      setActive("hero");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50 border-b border-terminal-border bg-terminal-bg/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="mb-2 flex items-center gap-2 text-xs text-terminal-muted">
          <span className="text-terminal-accent text-glow">$</span>
          <span className="truncate text-terminal-body">
            exec portfolio-nav — session active
          </span>
          <span className="ml-auto text-terminal-accent text-glow cursor-blink" />
        </div>
        <nav
          className="cmd-scroll flex gap-1 overflow-x-auto pb-1"
          aria-label="Primary"
        >
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollTo(link.id)}
              className={`shrink-0 rounded border bg-terminal-surface px-3 py-1.5 text-left text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent ${
                active === link.id
                  ? "nav-active"
                  : "border-terminal-border text-terminal-accent-soft hover:border-terminal-accent hover:text-terminal-accent"
              }`}
            >
              <span className="text-terminal-muted">$</span> {link.label}
            </button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
