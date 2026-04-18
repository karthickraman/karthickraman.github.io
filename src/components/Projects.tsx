"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/resume";

function slugTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="terminal-card gradient-border rounded-xl border border-terminal-border bg-terminal-surface"
      >
        <div className="window-chrome">
          <span className="window-dot bg-[#ff5f56]" aria-hidden />
          <span className="window-dot bg-[#ffbd2e]" aria-hidden />
          <span className="window-dot bg-[#27c93f]" aria-hidden />
          <span className="ml-4 text-[11px] text-terminal-muted">
            ls -la ~/projects
          </span>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="sr-only">Projects</h2>
          <p className="mb-4 text-xs text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span> ls -la
            ~/projects
          </p>

          {/* Compact directory listing */}
          <div className="mb-8 overflow-x-auto rounded-lg border border-terminal-border/50 bg-terminal-bg/60 p-3 text-xs text-terminal-muted">
            <p className="text-terminal-accent-soft">
              total {projects.length}
            </p>
            {projects.map((p) => (
              <p key={p.title} className="whitespace-nowrap">
                drwxr-xr-x{" "}
                <span className="text-terminal-muted">staff</span>{" "}
                <span className="text-terminal-body">4096</span>{" "}
                <span className="text-terminal-cyan font-semibold">
                  {slugTitle(p.title)}/
                </span>
              </p>
            ))}
          </div>

          {/* Project README cards — 2-column grid on desktop */}
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="terminal-card group flex flex-col overflow-hidden rounded-lg border border-terminal-border/50 bg-terminal-bg/60 transition-all duration-300"
              >
                <div className="flex items-center justify-between border-b border-terminal-border/40 px-3 py-1.5 text-[11px]">
                  <span className="text-terminal-muted">
                    <span className="text-terminal-cyan/60">~/projects/</span>
                    {slugTitle(project.title)}/README.md
                  </span>
                  <span className="text-terminal-yellow/60">vim</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm text-terminal-accent text-glow font-semibold">
                    # {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-pretty text-sm text-terminal-body/80 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-3 inline-flex">
                    <span className="rounded-md border border-terminal-accent/20 bg-terminal-accent/5 px-2.5 py-1 text-xs text-terminal-accent font-semibold">
                      {project.metric}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techTags.map((tag) => (
                      <span
                        key={tag}
                        className="skill-tag rounded-md border border-terminal-border/40 bg-terminal-surface/40 px-2 py-0.5 text-[11px] text-terminal-blue"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
