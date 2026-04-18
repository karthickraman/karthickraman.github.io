"use client";

import { motion } from "framer-motion";
import { about, education, certifications, languages, personal } from "@/data/resume";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16">
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
            man 1 {personal.name.split(" ")[0].toLowerCase()}
          </span>
        </div>

        <div className="p-6 text-sm leading-relaxed md:p-8 md:text-[15px]">
          {/* NAME */}
          <div className="flex items-center gap-3">
            <span className="text-terminal-accent text-glow font-bold tracking-wider text-xs">
              NAME
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-terminal-accent/20 to-transparent" />
          </div>
          <p className="mt-3 pl-4 text-terminal-body">
            <span className="text-terminal-accent-soft font-semibold">
              {personal.name}
            </span>
            {" — "}
            {personal.title}
          </p>

          {/* SYNOPSIS */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-terminal-accent text-glow font-bold tracking-wider text-xs">
              SYNOPSIS
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-terminal-accent/20 to-transparent" />
          </div>
          <p className="mt-3 pl-4 text-pretty text-terminal-muted italic">
            {personal.tagline}
          </p>

          {/* DESCRIPTION */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-terminal-accent text-glow font-bold tracking-wider text-xs">
              DESCRIPTION
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-terminal-accent/20 to-transparent" />
          </div>
          <div className="mt-3 space-y-4 pl-4 text-terminal-body">
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-pretty"
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* OPTIONS (core stack) */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-terminal-accent text-glow font-bold tracking-wider text-xs">
              OPTIONS
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-terminal-accent/20 to-transparent" />
          </div>
          <div className="mt-3 grid gap-2 pl-4 sm:grid-cols-2">
            {about.coreStack.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-baseline gap-2 text-sm"
              >
                <span className="text-terminal-yellow">
                  --{item.toLowerCase().replace(/\s+/g, "-")}
                </span>
                <span className="text-xs text-terminal-accent/50">enabled</span>
              </motion.div>
            ))}
          </div>

          {/* EDUCATION */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-terminal-accent text-glow font-bold tracking-wider text-xs">
              EDUCATION
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-terminal-accent/20 to-transparent" />
          </div>
          <div className="mt-3 pl-4 text-terminal-muted">
            <p className="text-terminal-body">{education.degree}</p>
            <p>{education.institution}</p>
            <p>
              {education.period} &middot; {education.location}
            </p>
          </div>

          {/* CERTIFICATIONS */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-terminal-cyan text-glow-cyan font-bold tracking-wider text-xs">
              CERTIFICATIONS
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-terminal-cyan/20 to-transparent" />
          </div>
          <div className="mt-3 space-y-1 pl-4">
            {certifications.map((cert) => (
              <p key={cert} className="text-terminal-body text-sm">
                <span className="text-terminal-yellow mr-2">✦</span>
                {cert}
              </p>
            ))}
          </div>

          {/* LANGUAGES */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-terminal-cyan text-glow-cyan font-bold tracking-wider text-xs">
              LANGUAGES
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-terminal-cyan/20 to-transparent" />
          </div>
          <div className="mt-3 space-y-1 pl-4">
            {languages.map((lang) => (
              <p key={lang.language} className="text-sm">
                <span className="text-terminal-accent-soft">
                  {lang.language}
                </span>
                <span className="text-terminal-muted">
                  {" — "}
                  {lang.proficiency}
                </span>
              </p>
            ))}
          </div>

          {/* SEE ALSO */}
          <p className="mt-8 border-t border-terminal-border pt-4 text-xs text-terminal-muted">
            SEE ALSO:{" "}
            <span className="text-terminal-blue">skills</span>(1),{" "}
            <span className="text-terminal-blue">experience</span>(1),{" "}
            <span className="text-terminal-blue">projects</span>(1)
          </p>
        </div>
      </motion.div>
    </section>
  );
}
