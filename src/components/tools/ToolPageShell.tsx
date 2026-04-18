import type { ReactNode } from "react";
import Link from "next/link";
import type { ToolContent } from "@/lib/tools-content";
import { ToolWidget } from "./ToolWidget";
import { JsonToolWidget } from "./JsonToolWidget";
import { Breadcrumbs } from "./Breadcrumbs";
import { ToolFAQ } from "./ToolFAQ";
import { RelatedTools } from "./RelatedTools";
import { ToolJsonLd } from "./JsonLd";

interface ToolPageShellProps {
  tool: ToolContent;
  /** Optional rich UI rendered after the hero and before the terminal widget. */
  beforeWidget?: ReactNode;
}

export function ToolPageShell({ tool, beforeWidget }: ToolPageShellProps) {
  const presets = tool.examples
    .filter((e) => e.input && e.input !== tool.defaultInput)
    .slice(0, 4)
    .map((e) => ({ label: e.title, value: e.input }));

  return (
    <article className="space-y-12 pb-16 pt-6 sm:pt-10">
      <ToolJsonLd tool={tool} />

      <Breadcrumbs
        items={[
          { label: "~", href: "/" },
          { label: "tools", href: "/tools/" },
          { label: tool.slug },
        ]}
      />

      <header className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-terminal-cyan">
          $ exec {tool.toolName}
        </p>
        <h1 className="font-mono text-3xl font-semibold leading-snug tracking-tight text-terminal-body sm:text-4xl">
          {tool.h1}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-terminal-muted sm:text-lg">
          {tool.hero}
        </p>
      </header>

      {beforeWidget ? <div className="space-y-4">{beforeWidget}</div> : null}

      {tool.slug === "json-formatter" ? (
        <JsonToolWidget
          defaultInput={tool.defaultInput}
          inputLabel={tool.inputLabel}
          inputPlaceholder={tool.inputPlaceholder}
          inputRows={tool.inputRows}
          presets={presets}
        />
      ) : (
        <ToolWidget
          toolName={tool.toolName}
          defaultInput={tool.defaultInput}
          inputLabel={tool.inputLabel}
          inputPlaceholder={tool.inputPlaceholder}
          inputRows={tool.inputRows}
          presets={presets}
        />
      )}

      <section
        aria-labelledby="about-heading"
        className="space-y-4"
      >
        <h2
          id="about-heading"
          className="font-mono text-lg font-semibold text-terminal-accent text-glow sm:text-xl"
        >
          <span className="text-terminal-muted">$</span> cat about.md
        </h2>
        <div className="space-y-4 text-pretty text-sm leading-relaxed text-terminal-body sm:text-base">
          {tool.about.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="examples-heading"
        className="space-y-4"
      >
        <h2
          id="examples-heading"
          className="font-mono text-lg font-semibold text-terminal-accent text-glow sm:text-xl"
        >
          <span className="text-terminal-muted">$</span> ls examples/
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tool.examples.map((ex, i) => (
            <div
              key={i}
              className="terminal-card flex flex-col gap-2 rounded-lg border border-terminal-border bg-terminal-surface/70 p-4"
            >
              <span className="text-sm font-semibold text-terminal-cyan">
                {ex.title}
              </span>
              <code className="block overflow-x-auto rounded-md border border-terminal-border bg-terminal-bg/60 px-3 py-2 font-mono text-xs text-terminal-body">
                {ex.input || "(empty input)"}
              </code>
              {ex.description ? (
                <p className="text-xs leading-relaxed text-terminal-muted">
                  {ex.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <ToolFAQ items={tool.faq} />

      <RelatedTools slugs={tool.related} />

      <footer className="rounded-lg border border-terminal-border bg-terminal-surface/40 p-4 text-xs text-terminal-muted">
        <span className="text-terminal-accent">$ </span>
        Privacy: this tool runs entirely in your browser. Your input is never
        sent to a server, never logged, and never stored.{" "}
        <Link
          href="/tools/"
          className="text-terminal-cyan underline-offset-4 hover:underline"
        >
          ← back to all tools
        </Link>
      </footer>
    </article>
  );
}
