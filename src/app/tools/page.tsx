import type { Metadata } from "next";
import Link from "next/link";

/** Avoid accidental dynamic / RSC edge cases on the tools index. */
export const dynamic = "force-static";
import { TOOLS_CONTENT, SITE_URL } from "@/lib/tools-content";
import { Breadcrumbs } from "@/components/tools/Breadcrumbs";
import { ToolsIndexJsonLd } from "@/components/tools/JsonLd";

const PAGE_TITLE = "Developer Tools — Karthick Pattabiraman";
const PAGE_DESCRIPTION =
  "Free, browser-based developer utilities: JWT decoder, JSON formatter, Base64 encoder, HTTP status codes, epoch converter, timezone tool, user-agent parser, cron explainer. Nothing is sent to a server.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/tools/",
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/tools/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function ToolsIndexPage() {
  const toolUrls = TOOLS_CONTENT.map((t) => ({
    name: t.h1,
    url: `${SITE_URL}/tools/${t.slug}/`,
  }));

  return (
    <article className="space-y-10 pb-16 pt-6 sm:pt-10">
      <ToolsIndexJsonLd toolUrls={toolUrls} />

      <Breadcrumbs
        items={[
          { label: "~", href: "/" },
          { label: "tools" },
        ]}
      />

      <header className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-terminal-cyan">
          $ ls /tools
        </p>
        <h1 className="font-mono text-3xl font-semibold leading-snug tracking-tight text-terminal-body sm:text-4xl">
          Developer Tools
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-terminal-muted sm:text-lg">
          A small collection of utilities I reach for daily — built for the
          terminal-loving developer. Decode JWTs, format JSON, look up HTTP
          status codes, convert epochs, parse user agents, and more. Everything
          runs in your browser; no input is ever transmitted.
        </p>
        <p className="text-xs text-terminal-muted/80">
          Tip: on the homepage, hit{" "}
          <kbd className="rounded border border-terminal-border bg-terminal-surface px-1.5 py-0.5 text-[10px] text-terminal-accent">
            ⌘K
          </kbd>{" "}
          for an interactive terminal that runs every tool in one place.
        </p>
      </header>

      <section
        id="tool-output"
        aria-label="All tools"
        tabIndex={-1}
        className="grid scroll-mt-32 gap-4 outline-none sm:grid-cols-2 sm:scroll-mt-28 lg:grid-cols-3"
      >
        {TOOLS_CONTENT.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}/`}
            className="terminal-card group flex h-full flex-col gap-3 rounded-xl border border-terminal-border bg-terminal-surface/70 p-5 transition hover:border-terminal-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-base font-semibold text-terminal-accent text-glow">
                {tool.toolName}
              </span>
              <span className="rounded border border-terminal-border bg-terminal-bg/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-terminal-muted">
                /{tool.slug}
              </span>
            </div>
            <h2 className="text-sm font-medium leading-tight text-terminal-body group-hover:text-terminal-accent-soft">
              {tool.h1}
            </h2>
            <p className="text-xs leading-relaxed text-terminal-muted">
              {tool.tagline}
            </p>
            <span className="mt-auto pt-2 text-xs text-terminal-cyan/80">
              open →
            </span>
          </Link>
        ))}
      </section>
    </article>
  );
}
