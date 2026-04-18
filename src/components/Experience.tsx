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
      className="mx-auto max-w-5xl scroll-mt-32 px-4 py-16 md:scroll-mt-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="terminal-card gradient-border rounded-xl border border-terminal-border bg-terminal-surface"
      >
        <div className="window-chrome">
          <span className="flex shrink-0 items-center gap-1.5" aria-hidden>
            <span className="window-dot bg-[#ff5f56]" />
            <span className="window-dot bg-[#ffbd2e]" />
            <span className="window-dot bg-[#27c93f]" />
          </span>
          <span className="chrome-title min-w-0 text-[11px] leading-none text-terminal-muted">
            git log --pretty=fuller career
          </span>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="sr-only">Experience</h2>
          <p className="mb-8 break-words text-xs text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span> git log
            --reverse --pretty=fuller career
          </p>

          <div className="relative space-y-0">
            {/* Timeline gradient line */}
            <div className="timeline-line" />

            {experiences.map((job, index) => {
              const hash = shortHash(
                `${job.company}-${job.role}-${job.period}`
              );
              const isHead = index === 0;

              return (
                <motion.article
                  key={`${job.company}-${job.role}-${job.period}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="relative min-w-0 py-5 pl-5 text-sm sm:py-6 sm:pl-6"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-8 h-2.5 w-2.5 -translate-x-[3.5px] rounded-full border-2 ${
                      isHead
                        ? "border-terminal-accent bg-terminal-accent shadow-[0_0_8px_rgba(0,255,65,0.4)]"
                        : "border-terminal-cyan bg-terminal-bg"
                    }`}
                  />

                  <p>
                    <span className="text-terminal-yellow">commit</span>{" "}
                    <span className="text-terminal-accent-soft">{hash}</span>
                    {isHead && (
                      <span className="ml-2 text-terminal-accent text-glow">
                        (HEAD -&gt; career)
                      </span>
                    )}
                  </p>
                  <p className="mt-1 break-words text-xs text-terminal-muted">
                    Author: {personal.name} &lt;
                    <span className="text-terminal-blue">{personal.email}</span>
                    &gt;
                  </p>
                  <p className="text-xs text-terminal-muted">
                    Date:{"   "}
                    <span className="text-terminal-body">{job.period}</span>
                  </p>

                  <div className="mt-4 rounded-lg border border-terminal-border/50 bg-terminal-bg/60 p-3 sm:p-4">
                    <h3 className="text-pretty text-base font-semibold leading-snug text-terminal-body sm:text-lg">
                      <span>{job.role}</span>{" "}
                      <span className="text-terminal-muted">@</span>{" "}
                      <span className="text-terminal-cyan text-glow-cyan">
                        {job.company}
                      </span>
                      <span className="mt-1 block text-sm font-normal text-terminal-muted sm:mt-0 sm:inline sm:text-base sm:font-semibold">
                        {" "}
                        — {job.location}
                      </span>
                    </h3>
                    <p className="mt-2 text-pretty text-terminal-muted">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-3 space-y-1.5 pl-2">
                    {job.highlights.map((h, j) => (
                      <motion.p
                        key={j}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: j * 0.03 }}
                        className="diff-add text-pretty text-sm text-terminal-body"
                      >
                        {h}
                      </motion.p>
                    ))}
                  </div>

                  {job.techStack && job.techStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 pl-2">
                      {job.techStack.map((t) => (
                        <span
                          key={t}
                          className="skill-tag rounded-md border border-terminal-border/40 bg-terminal-surface/50 px-2 py-0.5 text-[11px] text-terminal-blue"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
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
