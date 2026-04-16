"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/resume";

function buildTreeLines(): { text: string; isCategory: boolean }[] {
  const lines: { text: string; isCategory: boolean }[] = [{ text: ".", isCategory: false }];
  skills.forEach((cat, ci) => {
    const catLast = ci === skills.length - 1;
    lines.push({
      text: `${catLast ? "└── " : "├── "}${cat.category}`,
      isCategory: true,
    });
    const indent = catLast ? "    " : "│   ";
    cat.skills.forEach((skill, si) => {
      const skLast = si === cat.skills.length - 1;
      lines.push({
        text: `${indent}${skLast ? "└── " : "├── "}${skill}`,
        isCategory: false,
      });
    });
  });
  return lines;
}

export function Skills() {
  const treeLines = buildTreeLines();
  const totalSkills = skills.reduce((n, c) => n + c.skills.length, 0);

  return (
    <section
      id="skills"
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
            tree ~/stack
          </span>
        </div>
        <div className="p-6">
          <p className="mb-4 text-xs text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span> tree ~/stack
          </p>
          <div className="overflow-x-auto text-xs leading-relaxed md:text-sm">
            {treeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
                className={
                  line.isCategory
                    ? "text-terminal-yellow font-semibold"
                    : "text-terminal-accent-soft"
                }
              >
                <pre className="whitespace-pre">{line.text}</pre>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 border-t border-dashed border-terminal-border pt-4 text-xs text-terminal-muted">
            <p>
              <span className="text-terminal-accent-soft">
                {skills.length} directories
              </span>
              , {totalSkills} files
            </p>
          </div>

          <div className="mt-4 text-xs text-terminal-muted">
            <p>
              <span className="text-terminal-accent text-glow">$</span>{" "}
              npm install --save-dev expertise
            </p>
            <p className="mt-1">
              <span className="text-terminal-accent-soft">added</span>{" "}
              {totalSkills} packages in 0.009s
            </p>
            <p className="text-terminal-muted">
              found <span className="text-terminal-accent">0</span> vulnerabilities
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
