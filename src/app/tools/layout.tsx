import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-terminal-bg pb-[calc(4rem+env(safe-area-inset-bottom,0px))] font-mono text-terminal-body">
      <a
        href="#tools-content"
        className="fixed left-[max(1rem,env(safe-area-inset-left,0px))] top-0 z-[100] -translate-y-full rounded-md border border-terminal-accent/40 bg-terminal-surface px-4 py-2 text-sm font-medium text-terminal-accent shadow-lg transition-transform focus:translate-y-[max(1rem,env(safe-area-inset-top,0.5rem))] focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent focus-visible:ring-offset-2 focus-visible:ring-offset-terminal-bg"
      >
        Skip to content
      </a>
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
