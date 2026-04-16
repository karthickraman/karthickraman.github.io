"use client";

import { motion } from "framer-motion";
import { about, education, personal } from "@/data/resume";

export function About() {
  return (
    <section
      id="about"
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
            man 1 {personal.name.split(" ")[0].toLowerCase()}
          </span>
        </div>
        <div className="p-6 text-sm leading-relaxed md:text-[15px]">
          <div className="text-terminal-accent text-glow">
            <span className="font-bold">NAME</span>
          </div>
          <p className="mt-2 pl-4 text-terminal-body">
            <span className="text-terminal-accent-soft">{personal.name}</span>
            {" — "}
            {personal.title}
          </p>

          <div className="mt-8 text-terminal-accent text-glow">
            <span className="font-bold">SYNOPSIS</span>
          </div>
          <p className="mt-2 pl-4 text-pretty text-terminal-muted">
            {personal.tagline}
          </p>

          <div className="mt-8 border-t border-dashed border-terminal-border pt-6 text-terminal-accent text-glow">
            <span className="font-bold">DESCRIPTION</span>
          </div>
          <div className="mt-3 space-y-4 pl-4 text-terminal-body">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="text-pretty">{p}</p>
            ))}
          </div>

          <div className="mt-8 border-t border-dashed border-terminal-border pt-6 text-terminal-accent text-glow">
            <span className="font-bold">OPTIONS</span>
          </div>
          <div className="mt-3 grid gap-2 pl-4 sm:grid-cols-2">
            {about.coreStack.map((item) => (
              <div key={item} className="flex items-baseline gap-2 text-sm">
                <span className="text-terminal-yellow">--{item.toLowerCase().replace(/\s+/g, "-")}</span>
                <span className="text-terminal-muted text-xs">enabled</span>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-dashed border-terminal-border pt-6 text-terminal-accent text-glow">
            <span className="font-bold">EDUCATION</span>
          </div>
          <div className="mt-3 pl-4 text-terminal-muted">
            <p className="text-terminal-body">{education.degree}</p>
            <p>{education.institution}</p>
            <p>{education.period} &middot; {education.location}</p>
          </div>

          <p className="mt-8 border-t border-dashed border-terminal-border pt-4 text-xs text-terminal-muted">
            SEE ALSO: <span className="text-terminal-blue">skills</span>(1),{" "}
            <span className="text-terminal-blue">experience</span>(1),{" "}
            <span className="text-terminal-blue">projects</span>(1)
          </p>
        </div>
      </motion.div>
    </section>
  );
}
