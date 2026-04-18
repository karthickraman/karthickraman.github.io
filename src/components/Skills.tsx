"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/resume";

export function Skills() {
  const totalSkills = skills.reduce((n, c) => n + c.skills.length, 0);

  return (
    <section
      id="skills"
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
          <span className="window-dot bg-[#ff5f56]" aria-hidden />
          <span className="window-dot bg-[#ffbd2e]" aria-hidden />
          <span className="window-dot bg-[#27c93f]" aria-hidden />
          <span className="chrome-title ml-4 text-[11px] text-terminal-muted">
            tree ~/stack
          </span>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="sr-only">Skills</h2>
          <p className="mb-6 break-words text-xs text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span> tree
            ~/stack --group-directories-first
          </p>

          {/* Skill category grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((cat, ci) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: ci * 0.05 }}
                className="group rounded-lg border border-terminal-border/60 bg-terminal-bg/50 p-4 transition-all duration-300 hover:border-terminal-accent/20 hover:bg-terminal-bg/80"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="text-terminal-yellow font-semibold text-sm"
                    aria-hidden
                  >
                    📂
                  </span>
                  <span className="text-terminal-yellow font-semibold text-sm">
                    {cat.category}/
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-tag rounded-md border border-terminal-border/50 bg-terminal-surface/60 px-2 py-1 text-[11px] text-terminal-accent-soft"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-6 border-t border-terminal-border pt-4 text-xs text-terminal-muted">
            <div className="flex items-center justify-between">
              <p>
                <span className="text-terminal-accent-soft">
                  {skills.length} directories
                </span>
                , {totalSkills} files
              </p>
              <p>
                <span className="text-terminal-accent text-glow">$</span>{" "}
                <span className="text-terminal-muted">
                  found{" "}
                  <span className="text-terminal-accent">{totalSkills}</span>{" "}
                  capabilities
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
