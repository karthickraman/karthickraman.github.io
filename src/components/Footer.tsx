"use client";

import { personal } from "@/data/resume";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-terminal-border bg-terminal-surface px-4 py-3 text-[11px] text-terminal-muted">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 font-mono">
        <span>
          <span className="text-terminal-accent text-glow">STATUS</span>{" "}
          <span className="text-terminal-accent-soft">ready</span> &middot;{" "}
          <span className="text-terminal-body">NORMAL</span>
        </span>
        <span className="truncate">
          {personal.name} &copy; {year}
        </span>
        <span className="text-terminal-muted">
          utf-8 &middot; zsh &middot; terminal-portfolio v1.0
        </span>
      </div>
    </footer>
  );
}
