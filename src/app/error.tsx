"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-terminal-bg px-6 font-mono text-terminal-body">
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
  );
}
