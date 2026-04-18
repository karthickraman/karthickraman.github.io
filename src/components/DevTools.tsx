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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { execute, TOOLS } from "@/lib/devtools/registry";
import { OPEN_DEVTOOLS_EVENT } from "@/lib/open-devtools";
import { DevtoolsOutputLines } from "@/lib/devtools-output";
import type { OutputLine, Tool } from "@/lib/devtools/types";

type Block =
  | { id: string; kind: "input"; command: string }
  | { id: string; kind: "output"; lines: OutputLine[]; status: "ok" | "error" | "info" }
  | { id: string; kind: "palette" };

const WELCOME: OutputLine[] = [
  { text: "devtools v1.0  ·  type `help` to begin or `tools` to browse.", kind: "info" },
  { text: "tip: ⌘/Ctrl+K toggles this panel · Esc closes it.", kind: "muted" },
];

let __id = 0;
const nextId = () => `b${++__id}`;

function ToolCard({ tool, onPick }: { tool: Tool; onPick: (cmd: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPick(tool.examples[0] ?? tool.name)}
      className="terminal-card group flex flex-col gap-2 rounded-lg border border-terminal-border bg-terminal-surface/70 p-3 text-left transition hover:border-terminal-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-terminal-accent text-glow">
          {tool.name}
        </span>
        <span className="rounded border border-terminal-border bg-terminal-bg px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-terminal-muted">
          {tool.category}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-terminal-muted">{tool.description}</p>
      <code className="truncate text-[11px] text-terminal-cyan/90">{tool.usage}</code>
    </button>
  );
}

function PaletteBlock({ onPick }: { onPick: (cmd: string) => void }) {
  return (
    <div className="pl-4">
      <div className="mb-2 text-sm text-terminal-cyan font-semibold">tools palette:</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <ToolCard key={t.name} tool={t} onPick={onPick} />
        ))}
      </div>
      <div className="mt-2 text-[11px] text-terminal-muted">
        click any card to load an example into the prompt.
      </div>
    </div>
  );
}

export function DevTools() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: nextId(), kind: "output", status: "info", lines: WELCOME },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const reduceMotion = useReducedMotion() ?? false;
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const openPanel = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  useEffect(() => {
    const onProgrammaticOpen = () => setOpen(true);
    window.addEventListener(OPEN_DEVTOOLS_EVENT, onProgrammaticOpen);
    return () => window.removeEventListener(OPEN_DEVTOOLS_EVENT, onProgrammaticOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [blocks, open]);

  useEffect(() => {
    if (!open) return;
    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const focusableInPanel = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(selector)).filter(
        (el) =>
          !el.closest("[hidden]") &&
          !el.hasAttribute("disabled") &&
          el.tabIndex !== -1,
      );

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusableInPanel();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      const inPanel = active instanceof Node && panel.contains(active);
      if (!inPanel) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, blocks]);

  const runCommand = useCallback(async (raw: string) => {
    const command = raw.trim();
    if (!command || busy) return;

    setBusy(true);
    setBlocks((b) => [...b, { id: nextId(), kind: "input", command }]);
    setHistory((h) => (h[h.length - 1] === command ? h : [...h, command]));
    setHistoryIdx(-1);

    const result = await execute(command);

    if (result.control === "clear") {
      setBlocks([]);
      setBusy(false);
      return;
    }
    if (result.control === "exit") {
      setOpen(false);
      setBusy(false);
      return;
    }

    if (command.toLowerCase() === "tools") {
      setBlocks((b) => [...b, { id: nextId(), kind: "palette" }]);
      setBusy(false);
      return;
    }

    setBlocks((b) => [
      ...b,
      { id: nextId(), kind: "output", status: result.status, lines: result.lines },
    ]);
    setBusy(false);
  }, [busy]);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const v = input;
      setInput("");
      runCommand(v);
    },
    [input, runCommand],
  );

  const onKey = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const v = input;
        setInput("");
        runCommand(v);
        return;
      }
      if (e.key === "ArrowUp" && !e.shiftKey) {
        if (history.length === 0) return;
        e.preventDefault();
        const next = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(next);
        setInput(history[next]);
      }
      if (e.key === "ArrowDown" && !e.shiftKey) {
        if (historyIdx === -1) return;
        e.preventDefault();
        const next = historyIdx + 1;
        if (next >= history.length) {
          setHistoryIdx(-1);
          setInput("");
        } else {
          setHistoryIdx(next);
          setInput(history[next]);
        }
      }
    },
    [history, historyIdx, input, runCommand],
  );

  const pickFromPalette = useCallback((cmd: string) => {
    setInput(cmd);
    inputRef.current?.focus();
  }, []);

  const cardOutput = useMemo(
    () => blocks.map((block) => {
      if (block.kind === "input") {
        return (
          <div key={block.id} className="text-sm">
            <span className="text-terminal-accent text-glow">➜</span>{" "}
            <span className="text-terminal-cyan">~</span>{" "}
            <span className="text-terminal-body">{block.command}</span>
          </div>
        );
      }
      if (block.kind === "palette") {
        return <PaletteBlock key={block.id} onPick={pickFromPalette} />;
      }
      return (
        <DevtoolsOutputLines
          key={block.id}
          lines={block.lines}
          listClassName="pl-4"
          copyCodeAriaLabel="Copy to clipboard"
        />
      );
    }),
    [blocks, pickFromPalette],
  );

  return (
    <>
      <motion.button
        type="button"
        onClick={openPanel}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        aria-label="Open developer tools terminal"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-40 flex items-center gap-2 rounded-full border border-terminal-accent/40 bg-terminal-surface/90 px-4 py-3 font-mono text-xs text-terminal-accent shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(0,255,65,0.12)] backdrop-blur-md transition hover:border-terminal-accent hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
      >
        <span aria-hidden className="text-terminal-accent text-glow">$_</span>
        <span className="hidden sm:inline">devtools</span>
        <kbd className="hidden rounded border border-terminal-border bg-terminal-bg px-1.5 py-0.5 text-[10px] text-terminal-muted sm:inline">
          ⌘K
        </kbd>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="devtools-overlay"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-3 pb-3 pt-[max(1rem,env(safe-area-inset-top,0px))] backdrop-blur-sm sm:items-center sm:p-6"
            onClick={close}
          >
            <motion.div
              ref={panelRef}
              key="devtools-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Developer tools terminal"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="terminal-card gradient-border flex h-[78vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface shadow-2xl sm:h-[70vh]"
            >
              <div className="window-chrome">
                <span className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close devtools"
                    className="-ml-1 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-terminal-muted transition hover:bg-terminal-border/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
                  >
                    <span
                      className="window-dot bg-[#ff5f56] pointer-events-none"
                      aria-hidden
                    />
                  </button>
                  <span className="window-dot bg-[#ffbd2e]" aria-hidden />
                  <span className="window-dot bg-[#27c93f]" aria-hidden />
                </span>
                <span className="chrome-title min-w-0 text-center text-[11px] leading-none text-terminal-muted">
                  karthick@portfolio — devtools — zsh
                </span>
              </div>

              <div
                ref={scrollRef}
                className="cmd-scroll flex-1 space-y-3 overflow-y-auto p-4 sm:p-5"
              >
                {cardOutput}
                {busy ? (
                  <div className="pl-4 text-sm text-terminal-muted">
                    <span className="cursor-blink" />
                  </div>
                ) : null}
              </div>

              <form
                onSubmit={onSubmit}
                className="flex items-start gap-2 border-t border-terminal-border bg-terminal-bg/60 p-3"
              >
                <span className="mt-2 text-sm text-terminal-accent text-glow">➜</span>
                <span className="mt-2 text-sm text-terminal-cyan">~</span>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  placeholder="type a command — try `help`, `tools`, `status 502`, `base64 hello`"
                  className="min-h-[36px] flex-1 resize-none rounded-md border border-terminal-border bg-terminal-surface px-3 py-2 font-mono text-sm text-terminal-body placeholder:text-terminal-muted/70 focus:outline-none"
                  aria-label="Command input"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="rounded-md border border-terminal-accent/50 bg-terminal-accent/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-terminal-accent transition hover:bg-terminal-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  run
                </button>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
