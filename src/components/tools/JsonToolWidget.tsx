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

export interface JsonToolWidgetProps {
  defaultInput?: string;
  inputLabel: string;
  inputPlaceholder?: string;
  inputRows?: number;
  autoRun?: boolean;
  presets?: { label: string; value: string }[];
}

type TabId = "format" | "compare";

interface State {
  status: "idle" | "ok" | "error" | "info";
  lines: OutputLine[];
}

const toolName = "json";

export function JsonToolWidget({
  defaultInput = "",
  inputLabel,
  inputPlaceholder,
  inputRows = 8,
  autoRun = true,
  presets,
}: JsonToolWidgetProps) {
  const widgetId = useId();
  const inputId = `${widgetId}-a`;
  const inputBId = `${widgetId}-b`;
  const hintId = `${widgetId}-kbd-hint`;
  const liveId = `${widgetId}-live`;

  const [tab, setTab] = useState<TabId>("format");
  const [dualInFormat, setDualInFormat] = useState(false);
  const [a, setA] = useState(defaultInput);
  const [b, setB] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<State>({ status: "idle", lines: [] });
  const [liveMessage, setLiveMessage] = useState("");
  const reduceMotion = useReducedMotion() ?? false;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const inputBRef = useRef<HTMLTextAreaElement | null>(null);
  const ranOnceRef = useRef(false);

  const showSecondEditor = tab === "compare" || dualInFormat;

  const applyResult = useCallback((result: Awaited<ReturnType<typeof execute>>) => {
    const status =
      result.status === "ok" ? "ok" : result.status === "error" ? "error" : "info";
    setState({ status, lines: result.lines });
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
  }, []);

  const runFormat = useCallback(async () => {
    const value = a.trim();
    if (!value) {
      setLiveMessage("Nothing to run. Paste JSON first.");
      return;
    }
    if (busy) return;
    setBusy(true);
    setLiveMessage("Running tool…");
    const result = await execute(`${toolName} ${value}`.trim());
    applyResult(result);
  }, [a, applyResult, busy]);

  const runDiff = useCallback(async () => {
    const left = a.trim();
    const right = b.trim();
    if (!left || !right) {
      setLiveMessage("Compare needs non-empty JSON in both editors.");
      return;
    }
    if (busy) return;
    setBusy(true);
    setLiveMessage("Running diff…");
    const payload = `diff ${left}\n---\n${right}`;
    const result = await execute(`${toolName} ${payload}`.trim());
    applyResult(result);
  }, [a, b, applyResult, busy]);

  const run = useCallback(async () => {
    if (tab === "compare" || (tab === "format" && dualInFormat)) {
      await runDiff();
    } else {
      await runFormat();
    }
  }, [dualInFormat, runDiff, runFormat, tab]);

  useEffect(() => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;
    if (autoRun && defaultInput.trim()) {
      void (async () => {
        setBusy(true);
        setLiveMessage("Running tool…");
        const result = await execute(`${toolName} ${defaultInput.trim()}`.trim());
        applyResult(result);
      })();
    }
  }, [applyResult, autoRun, defaultInput]);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      void run();
    },
    [run],
  );

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>, from: "a" | "b") => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        void run();
        return;
      }
      if (e.key === "Enter" && !e.shiftKey && inputRows <= 2 && from === "a" && !showSecondEditor) {
        e.preventDefault();
        void run();
      }
    },
    [inputRows, run, showSecondEditor],
  );

  const onPreset = useCallback((value: string, label: string) => {
    setA(value);
    setLiveMessage(`Example loaded: ${label}. Input updated.`);
    inputRef.current?.focus();
  }, []);

  const statusUi = useMemo(() => {
    if (busy) {
      return { word: "Running", symbol: "…", color: "text-terminal-cyan" };
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

  const switchTab = useCallback((next: TabId) => {
    setTab(next);
    setLiveMessage(next === "compare" ? "Compare tab — two JSON editors." : "Format tab.");
  }, []);

  const toggleDual = useCallback(() => {
    setDualInFormat((v) => {
      const on = !v;
      if (on) {
        setLiveMessage("Second JSON editor shown. Fill both sides, then run.");
        queueMicrotask(() => inputBRef.current?.focus());
      } else {
        setLiveMessage("Second editor hidden — run uses the first JSON only.");
      }
      return on;
    });
  }, []);

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="terminal-card gradient-border overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface shadow-2xl"
      aria-label="json interactive tool"
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

      <div
        className="flex border-b border-terminal-border bg-terminal-bg/30 px-3 pt-3 sm:px-4"
        role="tablist"
        aria-label="JSON tool mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "format"}
          id={`${widgetId}-tab-format`}
          aria-controls={`${widgetId}-tabpanel`}
          onClick={() => switchTab("format")}
          className={`relative -mb-px rounded-t-md border border-b-0 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
            tab === "format"
              ? "border-terminal-border bg-terminal-surface text-terminal-accent"
              : "border-transparent bg-transparent text-terminal-muted hover:text-terminal-body"
          }`}
        >
          format
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "compare"}
          id={`${widgetId}-tab-compare`}
          aria-controls={`${widgetId}-tabpanel`}
          onClick={() => switchTab("compare")}
          className={`relative -mb-px rounded-t-md border border-b-0 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition ${
            tab === "compare"
              ? "border-terminal-border bg-terminal-surface text-terminal-accent"
              : "border-transparent bg-transparent text-terminal-muted hover:text-terminal-body"
          }`}
        >
          compare
        </button>
      </div>

      <form
        id={`${widgetId}-tabpanel`}
        role="tabpanel"
        aria-labelledby={tab === "format" ? `${widgetId}-tab-format` : `${widgetId}-tab-compare`}
        onSubmit={onSubmit}
        className="space-y-3 p-4 sm:p-5"
        aria-busy={busy}
      >
        {tab === "format" ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[11px] text-terminal-muted">
              Pretty-print, minify, or sort — prefix with{" "}
              <code className="text-terminal-cyan">minify</code> or{" "}
              <code className="text-terminal-cyan">sort</code>.
            </span>
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-terminal-body">
              <input
                type="checkbox"
                checked={dualInFormat}
                onChange={toggleDual}
                className="size-3.5 rounded border-terminal-border accent-terminal-accent"
              />
              <span>second JSON (diff)</span>
            </label>
          </div>
        ) : (
          <p className="text-[11px] text-terminal-muted">
            Structural diff — <span className="text-terminal-cyan">+</span> added,{" "}
            <span className="text-terminal-red">−</span> removed,{" "}
            <span className="text-terminal-yellow">~</span> changed.
          </p>
        )}

        <div
          className={
            tab === "compare"
              ? "grid gap-3 md:grid-cols-2"
              : showSecondEditor
                ? "grid gap-3"
                : ""
          }
        >
          <label htmlFor={inputId} className="flex min-h-0 min-w-0 flex-col gap-2">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terminal-muted">
              <span className="text-terminal-accent text-glow" aria-hidden="true">
                $
              </span>
              {tab === "compare" ? "JSON A (left)" : inputLabel}
            </span>
            <textarea
              id={inputId}
              ref={inputRef}
              value={a}
              onChange={(e) => setA(e.target.value)}
              onKeyDown={(e) => onKey(e, "a")}
              rows={inputRows}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder={inputPlaceholder}
              aria-describedby={hintId}
              className="min-h-[8rem] w-full resize-y rounded-md border border-terminal-border bg-terminal-bg/70 px-3 py-2 font-mono text-sm text-terminal-body placeholder:text-terminal-muted/60 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent md:min-h-[10rem]"
            />
          </label>

          {showSecondEditor ? (
            <label htmlFor={inputBId} className="flex min-h-0 min-w-0 flex-col gap-2">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-terminal-muted">
                <span className="text-terminal-accent text-glow" aria-hidden="true">
                  $
                </span>
                JSON B (right)
              </span>
              <textarea
                id={inputBId}
                ref={inputBRef}
                value={b}
                onChange={(e) => setB(e.target.value)}
                onKeyDown={(e) => onKey(e, "b")}
                rows={inputRows}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                placeholder='{"same":"shape as A"}'
                className="min-h-[8rem] w-full resize-y rounded-md border border-terminal-border bg-terminal-bg/70 px-3 py-2 font-mono text-sm text-terminal-body placeholder:text-terminal-muted/60 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent md:min-h-[10rem]"
              />
            </label>
          ) : null}
        </div>

        {tab === "format" && presets && presets.length > 0 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Example inputs">
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
            {showSecondEditor ? "run diff" : "run"}
          </button>
          <button
            type="button"
            onClick={() => {
              setA("");
              setB("");
              setState({ status: "idle", lines: [] });
              setLiveMessage("Output cleared.");
              inputRef.current?.focus();
            }}
            className="rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 text-xs font-semibold uppercase tracking-wider text-terminal-muted transition hover:border-terminal-accent/40 hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
          >
            clear
          </button>
          <span id={hintId} className="text-[10px] text-terminal-muted/80">
            <span className="sr-only">Press Command or Control plus Enter to run. </span>
            <span className="hidden sm:inline" aria-hidden="true">
              ⌘/Ctrl+Enter to run
            </span>
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
          <p className="text-sm text-terminal-muted">output will appear here.</p>
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
