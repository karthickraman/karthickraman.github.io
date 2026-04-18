import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-terminal-bg pb-[calc(4rem+env(safe-area-inset-bottom,0px))] font-mono text-terminal-body">
      <div
        className="fixed left-[max(1rem,env(safe-area-inset-left,0px))] top-0 z-[100] flex -translate-y-full flex-col gap-1 rounded-md border border-terminal-accent/40 bg-terminal-surface p-2 text-sm font-medium text-terminal-accent shadow-lg transition-transform focus-within:translate-y-[max(1rem,env(safe-area-inset-top,0.5rem))]"
        role="navigation"
        aria-label="Skip links"
      >
        <a
          href="#tools-content"
          className="rounded px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent focus-visible:ring-offset-2 focus-visible:ring-offset-terminal-bg"
        >
          Skip to content
        </a>
        <a
          href="#tool-output"
          className="rounded px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent focus-visible:ring-offset-2 focus-visible:ring-offset-terminal-bg"
        >
          Skip to tool output
        </a>
      </div>
      <Navbar />
      <div
        id="tools-content"
        className="mx-auto max-w-5xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]"
      >
        {children}
      </div>
      <Footer />
    </main>
  );
}
