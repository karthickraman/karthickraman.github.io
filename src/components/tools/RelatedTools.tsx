import Link from "next/link";
import { TOOLS_CONTENT_BY_SLUG } from "@/lib/tools-content";

export function RelatedTools({ slugs }: { slugs: string[] }) {
  const related = slugs
    .map((s) => TOOLS_CONTENT_BY_SLUG[s])
    .filter(Boolean);
  if (related.length === 0) return null;
  return (
    <section
      aria-labelledby="related-heading"
      className="space-y-4"
    >
      <h2
        id="related-heading"
        className="font-mono text-lg font-semibold text-terminal-accent text-glow sm:text-xl"
      >
        <span className="text-terminal-muted">$</span> ls related-tools/
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}/`}
            className="terminal-card group flex flex-col gap-2 rounded-lg border border-terminal-border bg-terminal-surface/70 p-4 transition hover:border-terminal-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
          >
            <span className="text-sm font-semibold text-terminal-accent group-hover:text-glow">
              {tool.h1}
            </span>
            <span className="text-xs leading-relaxed text-terminal-muted">
              {tool.tagline}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
