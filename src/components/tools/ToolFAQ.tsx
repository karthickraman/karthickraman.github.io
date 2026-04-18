import type { FAQEntry } from "@/lib/tools-content";

export function ToolFAQ({ items }: { items: FAQEntry[] }) {
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="faq-heading"
      className="space-y-4"
    >
      <h2
        id="faq-heading"
        className="font-mono text-lg font-semibold text-terminal-accent text-glow sm:text-xl"
      >
        <span className="text-terminal-muted">$</span> man --faq
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-terminal-border bg-terminal-surface/70 p-4 open:border-terminal-accent/30 open:shadow-[0_0_24px_rgba(0,255,65,0.04)]"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-medium text-terminal-body">
              <span className="flex-1">
                <span className="mr-2 text-terminal-cyan">Q.</span>
                {item.q}
              </span>
              <span
                aria-hidden
                className="mt-0.5 shrink-0 select-none text-terminal-muted transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-terminal-muted">
              <span className="mr-2 font-semibold text-terminal-accent-soft">A.</span>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
