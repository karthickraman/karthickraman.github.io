"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/resume";

function slugTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
        transition={{ duration: 0.45 }}
        className="terminal-card rounded-lg border border-terminal-border bg-terminal-surface"
      >
        <div className="flex items-center gap-2 border-b border-terminal-border bg-terminal-bg px-3 py-2">
          <span className="size-3 rounded-full bg-[#ff5f56]" aria-hidden />
          <span className="size-3 rounded-full bg-[#ffbd2e]" aria-hidden />
          <span className="size-3 rounded-full bg-[#27c93f]" aria-hidden />
          <span className="ml-3 text-[11px] text-terminal-muted">
            ls -la ~/projects
          </span>
        </div>
        <div className="p-6">
          <p className="mb-4 text-xs text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span> ls -la ~/projects
          </p>

          {/* Directory listing */}
          <div className="overflow-x-auto rounded border border-terminal-border bg-terminal-bg p-3 text-xs text-terminal-muted">
            <p className="text-terminal-accent-soft">total {projects.length}</p>
            {projects.map((p) => (
              <p key={p.title} className="whitespace-nowrap">
                drwxr-xr-x{" "}
                <span className="text-terminal-muted">staff</span>{" "}
                <span className="text-terminal-body">4096</span>{" "}
                <span className="text-terminal-accent-soft font-semibold">
                  {slugTitle(p.title)}/
                </span>
              </p>
            ))}
          </div>

          {/* Project README cards */}
          <div className="mt-8 space-y-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="terminal-card overflow-hidden rounded-lg border border-terminal-border bg-terminal-bg"
              >
                <div className="flex items-center justify-between border-b border-terminal-border px-3 py-1.5 text-[11px]">
                  <span className="text-terminal-muted">
                    <span className="text-terminal-accent-soft">~/projects/</span>
                    {slugTitle(project.title)}/README.md
                  </span>
                  <span className="text-terminal-yellow">vim</span>
                </div>
                <div className="p-4 text-sm">
                  <h3 className="text-base text-terminal-accent text-glow font-semibold">
                    # {project.title}
                  </h3>
                  <p className="mt-3 text-pretty text-terminal-body leading-relaxed">
                    {project.description}
                  </p>
                  <p className="mt-3 inline-block rounded border border-terminal-accent/20 bg-terminal-accent/5 px-2 py-0.5 text-xs text-terminal-accent font-semibold">
                    {project.metric}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-terminal-border bg-terminal-surface px-2 py-0.5 text-[11px] text-terminal-blue"
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
