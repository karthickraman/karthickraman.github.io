"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { execute } from "@/lib/devtools/registry";
import type { OutputLine } from "@/lib/devtools/types";
import { DevtoolsOutputLines } from "@/lib/devtools-output";

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
  const widgetId = useId();
  const inputId = `${widgetId}-input`;
  const hintId = `${widgetId}-kbd-hint`;
  const liveId = `${widgetId}-live`;

  const [input, setInput] = useState(defaultInput);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<State>({ status: "idle", lines: [] });
  const [liveMessage, setLiveMessage] = useState("");
  const reduceMotion = useReducedMotion() ?? false;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const ranOnceRef = useRef(false);

  const runCommand = useCallback(
    async (rawInput: string) => {
      const value = rawInput.trim();
      if (!value) {
        setLiveMessage("Nothing to run. Add or paste input first.");
        return;
      }
      if (busy) return;
      setBusy(true);
      setLiveMessage("Running tool…");
      const command = `${toolName} ${value}`.trim();
      const result = await execute(command);
      const status =
        result.status === "ok"
          ? "ok"
          : result.status === "error"
            ? "error"
            : "info";
      setState({
        status,
        lines: result.lines,
      });
      setBusy(false);
      const lineCount = result.lines.length;
      if (status === "error") {
        setLiveMessage(
          lineCount > 0
            ? `Finished with errors. ${lineCount} line${lineCount === 1 ? "" : "s"} in the output below.`
            : "Finished with errors. Review the output below.",
        );
      } else if (status === "info") {
        setLiveMessage(
          lineCount > 0
            ? `Information ready. ${lineCount} line${lineCount === 1 ? "" : "s"} in the output below.`
            : "Information ready. See the output below.",
        );
      } else {
        setLiveMessage(
          lineCount > 0
            ? `Success. ${lineCount} line${lineCount === 1 ? "" : "s"} of output below.`
            : "Success. Output updated below.",
        );
      }
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
      setLiveMessage("Running tool…");
      void execute(toolName).then((result) => {
        const status =
          result.status === "ok"
            ? "ok"
            : result.status === "error"
              ? "error"
              : "info";
        setState({
          status,
          lines: result.lines,
        });
        setBusy(false);
        const n = result.lines.length;
        if (status === "error") {
          setLiveMessage(
            n > 0
              ? `Finished with errors. ${n} line${n === 1 ? "" : "s"} in the output below.`
              : "Finished with errors. Review the output below.",
          );
        } else if (status === "info") {
          setLiveMessage(
            n > 0
              ? `Information ready. ${n} line${n === 1 ? "" : "s"} in the output below.`
              : "Information ready. See the output below.",
          );
        } else {
          setLiveMessage(
            n > 0
              ? `Success. ${n} line${n === 1 ? "" : "s"} of output below.`
              : "Success. Output updated below.",
          );
        }
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

  const onPreset = useCallback((value: string, label: string) => {
    setInput(value);
    setLiveMessage(`Example loaded: ${label}. Input updated.`);
    inputRef.current?.focus();
  }, []);

  /** Words + non-color cue for status (color-blind / low-vision friendly). */
  const statusUi = useMemo(() => {
    if (busy) {
      return {
        word: "Running",
        symbol: "…",
        color: "text-terminal-cyan",
      };
    }
    if (state.status === "error") {
      return { word: "Failed", symbol: "✗", color: "text-terminal-red" };
    }
    if (state.status === "ok") {
      return { word: "Success", symbol: "✓", color: "text-terminal-accent" };
    }
    if (state.status === "info") {
      return { word: "Info", symbol: "ℹ", color: "text-terminal-cyan" };
    }
    return { word: "Ready", symbol: "·", color: "text-terminal-muted" };
  }, [busy, state.status]);

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="terminal-card gradient-border overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface shadow-2xl"
      aria-label={`${toolName} interactive tool`}
    >
      <p id={liveId} className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

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
          className={`ml-2 flex shrink-0 items-center gap-1 self-center text-[10px] font-semibold leading-none tracking-wide ${statusUi.color}`}
          title={`Status: ${statusUi.word}`}
        >
          <span className="font-mono" aria-hidden="true">
            {statusUi.symbol}
          </span>
          <span className="max-w-[4.5rem] truncate sm:max-w-none">{statusUi.word}</span>
        </span>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-3 p-4 sm:p-5"
        aria-busy={busy}
      >
        <label htmlFor={inputId} className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terminal-muted">
            <span className="text-terminal-accent text-glow" aria-hidden="true">
              $
            </span>
            {inputLabel}
          </span>
          <textarea
            id={inputId}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            rows={inputRows}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={inputPlaceholder}
            aria-describedby={hintId}
            className="w-full resize-y rounded-md border border-terminal-border bg-terminal-bg/70 px-3 py-2 font-mono text-sm text-terminal-body placeholder:text-terminal-muted/60 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
          />
        </label>

        {presets && presets.length > 0 ? (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Example inputs"
          >
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onPreset(p.value, p.label)}
                aria-label={`Load example: ${p.label}`}
                className="rounded-md border border-terminal-border bg-terminal-bg/40 px-2.5 py-1 text-[11px] text-terminal-muted transition hover:border-terminal-accent/40 hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className="rounded-md border border-terminal-accent/50 bg-terminal-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-terminal-accent transition hover:bg-terminal-accent/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            run
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setState({ status: "idle", lines: [] });
              setLiveMessage("Output cleared.");
              inputRef.current?.focus();
            }}
            className="rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-xs font-semibold uppercase tracking-wider text-terminal-muted transition hover:border-terminal-accent/40 hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
          >
            clear
          </button>
          <span id={hintId} className="text-[10px] text-terminal-muted/80">
            <span className="sr-only">
              {inputRows <= 2
                ? "From the input field, press Enter to run. "
                : "From the input field, press Command or Control plus Enter to run. "}
            </span>
            {inputRows <= 2 ? (
              <span className="hidden sm:inline" aria-hidden="true">
                press enter to run
              </span>
            ) : (
              <span className="hidden sm:inline" aria-hidden="true">
                ⌘/Ctrl+Enter to run
              </span>
            )}
          </span>
        </div>
      </form>

      <div
        id="tool-output"
        role="region"
        aria-label="Tool output"
        aria-busy={busy}
        tabIndex={-1}
        className="scroll-mt-32 border-t border-terminal-border bg-terminal-bg/40 p-4 outline-none sm:scroll-mt-28"
      >
        {state.lines.length === 0 && !busy ? (
          <p className="text-sm text-terminal-muted">
            output will appear here.
          </p>
        ) : busy ? (
          <p className="text-sm text-terminal-muted" aria-hidden="true">
            <span className="cursor-blink" />
          </p>
        ) : (
          <DevtoolsOutputLines lines={state.lines} />
        )}
      </div>
    </motion.section>
  );
}
