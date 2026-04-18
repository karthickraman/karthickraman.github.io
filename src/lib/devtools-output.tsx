"use client";

import { useCallback, useState } from "react";
import type { OutputLine } from "@/lib/devtools/types";

export const DEVTOOLS_OUTPUT_KIND_CLASS: Record<
  NonNullable<OutputLine["kind"]>,
  string
> = {
  default: "text-terminal-body",
  muted: "text-terminal-muted",
  success: "text-terminal-accent text-glow",
  error: "text-terminal-red",
  warn: "text-terminal-yellow",
  info: "text-terminal-cyan text-glow-cyan",
  label: "text-terminal-cyan font-semibold",
  code: "text-terminal-body bg-terminal-bg/60 rounded-md border border-terminal-border px-3 py-2 whitespace-pre-wrap break-words font-mono",
  prompt: "text-terminal-accent",
};

export function DevtoolsCopyButton({
  text,
  ariaLabel,
}: {
  text: string;
  ariaLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* noop */
    }
  }, [text]);
  return (
    <button
      type="button"
      onClick={onCopy}
      className="ml-2 shrink-0 self-start rounded-md border border-terminal-border bg-terminal-surface px-2 py-1 text-[10px] uppercase tracking-wider text-terminal-muted transition hover:border-terminal-accent/50 hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
      aria-label={ariaLabel}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

export function DevtoolsOutputLines({
  lines,
  listClassName = "",
  copyCodeAriaLabel = "Copy result to clipboard",
}: {
  lines: OutputLine[];
  /** e.g. `pl-4` for devtools transcript indent */
  listClassName?: string;
  /** DevTools panel uses "Copy to clipboard". */
  copyCodeAriaLabel?: string;
}) {
  return (
    <div className={`space-y-1.5 ${listClassName}`}>
      {lines.map((line, i) => {
        const cls = DEVTOOLS_OUTPUT_KIND_CLASS[line.kind ?? "default"];
        if (line.kind === "code") {
          return (
            <div key={i} className="flex min-w-0 items-start gap-0">
              <pre
                className={`min-w-0 flex-1 overflow-x-auto text-left text-xs sm:text-[13px] ${cls}`}
              >
                {line.text}
              </pre>
              {line.copyable ? (
                <DevtoolsCopyButton
                  text={line.text}
                  ariaLabel={copyCodeAriaLabel}
                />
              ) : null}
            </div>
          );
        }
        return (
          <div key={i} className={`text-sm ${cls}`}>
            {line.prefix ? (
              <span className="text-terminal-muted">{line.prefix} </span>
            ) : null}
            {line.text || "\u00a0"}
          </div>
        );
      })}
    </div>
  );
}
