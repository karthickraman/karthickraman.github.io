"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-terminal-bg font-mono text-terminal-body">
      <div className="flex items-center justify-end gap-3 border-b border-terminal-border/80 bg-terminal-surface/40 px-4 py-3">
        <Link
          href="/"
          className="text-xs font-medium text-terminal-cyan underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
        >
          Home
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <h1 className="text-xl font-semibold text-terminal-accent">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-terminal-muted">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg border border-terminal-accent/40 bg-terminal-accent/10 px-5 py-2 text-sm font-semibold text-terminal-accent transition-colors hover:bg-terminal-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
