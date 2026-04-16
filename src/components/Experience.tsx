"use client";

import { motion } from "framer-motion";
import { experiences, personal } from "@/data/resume";

function shortHash(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16).padStart(7, "0").slice(0, 7);
}

export function Experience() {
  return (
    <section
      id="experience"
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
            git log --pretty=fuller career
          </span>
        </div>
        <div className="p-6">
          <p className="mb-6 text-xs text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span> git log
            --reverse --pretty=fuller career
          </p>

          <div className="space-y-0">
            {experiences.map((job, index) => {
              const hash = shortHash(`${job.company}-${job.role}-${job.period}`);
              const isHead = index === 0;

              return (
                <motion.article
                  key={`${job.company}-${job.role}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`border-l-2 py-6 pl-4 text-sm ${
                    index === 0
                      ? "border-terminal-accent/40"
                      : "border-terminal-border"
                  } ${index > 0 ? "border-t border-t-terminal-border/50" : ""}`}
                >
                  <p>
                    <span className="text-terminal-yellow">commit</span>{" "}
                    <span className="text-terminal-accent-soft">{hash}</span>
                    {isHead && (
                      <span className="ml-2 text-terminal-accent text-glow">
                        (HEAD -&gt; career)
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-terminal-muted">
                    Author: {personal.name} &lt;
                    <span className="text-terminal-blue">{personal.email}</span>
                    &gt;
                  </p>
                  <p className="text-xs text-terminal-muted">
                    Date:{"   "}
                    <span className="text-terminal-body">{job.period}</span>
                  </p>

                  <div className="mt-4 rounded border border-terminal-border/50 bg-terminal-bg/50 p-3">
                    <p className="font-semibold text-terminal-body">
                      {job.role}{" "}
                      <span className="text-terminal-muted">@</span>{" "}
                      <span className="text-terminal-accent-soft">{job.company}</span>
                      <span className="text-terminal-muted"> — {job.location}</span>
                    </p>
                    <p className="mt-2 text-terminal-muted text-pretty">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-3 space-y-1.5 pl-2">
                    {job.highlights.map((h, j) => (
                      <p key={j} className="diff-add text-pretty text-sm text-terminal-body">
                        {h}
                      </p>
                    ))}
                  </div>

                  {job.techStack && job.techStack.length > 0 && (
                    <p className="mt-3 pl-2 text-xs text-terminal-muted">
                      <span className="text-terminal-yellow">refs:</span>{" "}
                      {job.techStack.map((t, ti) => (
                        <span key={t}>
                          <span className="text-terminal-blue">{t}</span>
                          {ti < job.techStack!.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
