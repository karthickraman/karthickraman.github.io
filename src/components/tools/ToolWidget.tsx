"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { execute } from "@/lib/devtools/registry";
import type { OutputLine } from "@/lib/devtools/types";

const KIND_CLASS: Record<NonNullable<OutputLine["kind"]>, string> = {
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

interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps) {
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
      className="ml-2 shrink-0 self-start rounded-md border border-terminal-border bg-terminal-surface px-2 py-1 text-[10px] uppercase tracking-wider text-terminal-muted transition hover:border-terminal-accent/50 hover:text-terminal-accent"
      aria-label="Copy result to clipboard"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

interface OutputViewProps {
  lines: OutputLine[];
}

function OutputView({ lines }: OutputViewProps) {
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const cls = KIND_CLASS[line.kind ?? "default"];
        if (line.kind === "code") {
          return (
            <div key={i} className="flex min-w-0 items-start gap-0">
              <pre
                className={`min-w-0 flex-1 overflow-x-auto text-left text-xs sm:text-[13px] ${cls}`}
              >
                {line.text}
              </pre>
              {line.copyable ? <CopyButton text={line.text} /> : null}
            </div>
          );
        }
        return (
          <div key={i} className={`text-sm ${cls}`}>
            {line.prefix ? <span className="text-terminal-muted">{line.prefix} </span> : null}
            {line.text || "\u00a0"}
          </div>
        );
      })}
    </div>
  );
}

export interface ToolWidgetProps {
  /** Command name to dispatch through the registry (e.g. "jwt", "base64"). */
  toolName: string;
  /** Pre-filled input value. */
  defaultInput?: string;
  inputLabel: string;
  inputPlaceholder?: string;
  /** Number of textarea rows. 1 means a single-line look-and-feel. */
  inputRows?: number;
  /** Whether to auto-run on mount when defaultInput is non-empty. */
  autoRun?: boolean;
  /** Optional preset buttons (label + value to load into the input). */
  presets?: { label: string; value: string }[];
}

interface State {
  status: "idle" | "ok" | "error" | "info";
  lines: OutputLine[];
}

export function ToolWidget({
  toolName,
  defaultInput = "",
  inputLabel,
  inputPlaceholder,
  inputRows = 3,
  autoRun = true,
  presets,
}: ToolWidgetProps) {
  const [input, setInput] = useState(defaultInput);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<State>({ status: "idle", lines: [] });
  const reduceMotion = useReducedMotion() ?? false;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const ranOnceRef = useRef(false);

  const runCommand = useCallback(
    async (rawInput: string) => {
      const value = rawInput.trim();
      if (!value || busy) return;
      setBusy(true);
      const command = `${toolName} ${value}`.trim();
      const result = await execute(command);
      setState({
        status: result.status === "ok" ? "ok" : result.status === "error" ? "error" : "info",
        lines: result.lines,
      });
      setBusy(false);
    },
    [busy, toolName],
  );

  // Run once on mount with the default input so visitors see output immediately.
  useEffect(() => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;
    if (autoRun && defaultInput.trim()) {
      void runCommand(defaultInput);
    } else if (autoRun && !defaultInput.trim()) {
      // Tool with optional input (e.g. useragent) — run with empty args.
      setBusy(true);
      void execute(toolName).then((result) => {
        setState({
          status: result.status === "ok" ? "ok" : result.status === "error" ? "error" : "info",
          lines: result.lines,
        });
        setBusy(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      void runCommand(input);
    },
    [input, runCommand],
  );

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && inputRows <= 2) {
        e.preventDefault();
        void runCommand(input);
        return;
      }
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void runCommand(input);
      }
    },
    [input, runCommand, inputRows],
  );

  const onPreset = useCallback((value: string) => {
    setInput(value);
    inputRef.current?.focus();
  }, []);

  const statusLabel = useMemo(() => {
    if (busy) return "running";
    if (state.status === "ok") return "ok";
    if (state.status === "error") return "error";
    if (state.status === "info") return "info";
    return "ready";
  }, [busy, state.status]);

  const statusColor = useMemo(() => {
    if (busy) return "text-terminal-cyan";
    if (state.status === "error") return "text-terminal-red";
    if (state.status === "ok") return "text-terminal-accent";
    return "text-terminal-muted";
  }, [busy, state.status]);

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="terminal-card gradient-border overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface shadow-2xl"
      aria-label={`${toolName} interactive widget`}
    >
      <div className="window-chrome">
        <span className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="window-dot bg-[#ff5f56]" />
          <span className="window-dot bg-[#ffbd2e]" />
          <span className="window-dot bg-[#27c93f]" />
        </span>
        <span className="chrome-title min-w-0 text-center text-[11px] leading-none text-terminal-muted">
          karthick@portfolio — {toolName} — zsh
        </span>
        <span
          className={`ml-2 shrink-0 self-center text-[10px] leading-none uppercase tracking-widest ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 p-4 sm:p-5">
        <label className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span>
            {inputLabel}
          </span>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            rows={inputRows}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={inputPlaceholder}
            className="w-full resize-y rounded-md border border-terminal-border bg-terminal-bg/70 px-3 py-2 font-mono text-sm text-terminal-body placeholder:text-terminal-muted/60 focus:outline-none"
            aria-label={inputLabel}
          />
        </label>

        {presets && presets.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onPreset(p.value)}
                className="rounded-md border border-terminal-border bg-terminal-bg/40 px-2.5 py-1 text-[11px] text-terminal-muted transition hover:border-terminal-accent/40 hover:text-terminal-accent"
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md border border-terminal-accent/50 bg-terminal-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-terminal-accent transition hover:bg-terminal-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            run
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setState({ status: "idle", lines: [] });
              inputRef.current?.focus();
            }}
            className="rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-xs font-semibold uppercase tracking-wider text-terminal-muted transition hover:border-terminal-accent/40 hover:text-terminal-accent"
          >
            clear
          </button>
          {inputRows <= 2 ? (
            <span className="hidden text-[10px] text-terminal-muted/70 sm:inline">
              press enter to run
            </span>
          ) : (
            <span className="hidden text-[10px] text-terminal-muted/70 sm:inline">
              ⌘/Ctrl+Enter to run
            </span>
          )}
        </div>
      </form>

      <div className="border-t border-terminal-border bg-terminal-bg/40 p-4 sm:p-5">
        {state.lines.length === 0 && !busy ? (
          <p className="text-sm text-terminal-muted">
            output will appear here.
          </p>
        ) : busy ? (
          <p className="text-sm text-terminal-muted">
            <span className="cursor-blink" />
          </p>
        ) : (
          <OutputView lines={state.lines} />
        )}
      </div>
    </motion.section>
  );
}
