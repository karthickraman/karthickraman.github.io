"use client";

import { personal } from "@/data/resume";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-terminal-border bg-terminal-surface/80 px-4 py-3 text-[11px] text-terminal-muted backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 font-mono">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-accent animate-pulse" />
          <span className="text-terminal-accent text-glow">STATUS</span>{" "}
          <span className="text-terminal-accent-soft">ready</span>
          <span className="text-terminal-border">│</span>
          <span className="text-terminal-body">NORMAL</span>
        </span>
        <span className="truncate text-terminal-muted/60">
          {personal.name} &copy; {year}
        </span>
        <span className="text-terminal-muted/50">
          utf-8{" "}
          <span className="text-terminal-border">│</span>{" "}
          zsh{" "}
          <span className="text-terminal-border">│</span>{" "}
          terminal-portfolio v2.0
        </span>
      </div>
    </footer>
  );
}
