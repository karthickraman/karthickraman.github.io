"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { personal } from "@/data/resume";

function TypingLine({
  text,
  startDelay,
  charDelay = 0.022,
  className = "",
}: {
  text: string;
  startDelay: number;
  charDelay?: number;
  className?: string;
}) {
  const chars = text.split("");
  return (
    <span className={`inline ${className}`}>
      {chars.map((char, i) => (
        <motion.span
          key={`${startDelay}-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: startDelay + i * charDelay, duration: 0.01 }}
        >
          {char === " " ? "\u00a0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const line1 = "whoami";
  const line2 = personal.name;
  const line3 = personal.title;
  const line4 = personal.tagline;

  const d1 = 0.3;
  const d2 = d1 + line1.length * 0.022 + 0.4;
  const d3 = d2 + line2.length * 0.018 + 0.3;
  const d4 = d3 + line3.length * 0.018 + 0.3;
  const dEnd = d4 + line4.length * 0.012 + 0.6;

  return (
    <section
      id="hero"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 pb-16 pt-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45 }}
        className="terminal-card overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-terminal-border bg-terminal-bg px-3 py-2">
          <span className="size-3 rounded-full bg-[#ff5f56]" aria-hidden />
          <span className="size-3 rounded-full bg-[#ffbd2e]" aria-hidden />
          <span className="size-3 rounded-full bg-[#27c93f]" aria-hidden />
          <span className="ml-3 flex-1 truncate text-center text-[11px] text-terminal-muted">
            karthick@portfolio — zsh — 80x24
          </span>
        </div>

        <div className="p-6">
          {/* Profile image - centered on mobile, inline on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-6 flex justify-center md:float-right md:mb-0 md:ml-6"
          >
            <div className="rounded-lg border border-terminal-border p-1 shadow-[0_0_24px_rgba(74,250,126,0.12)]">
              <Image
                src="/profile.png"
                alt={personal.name}
                width={150}
                height={150}
                className="rounded-md object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Terminal output */}
          <div className="min-w-0 space-y-3 text-sm leading-relaxed md:text-base">
            <p className="text-terminal-muted">
              <span className="text-terminal-accent text-glow">➜</span>{" "}
              <span className="text-terminal-accent-soft">~</span>{" "}
              <TypingLine text={line1} startDelay={d1} />
            </p>

            <p className="border-l-2 border-terminal-accent/30 pl-3">
              <TypingLine
                text={line2}
                startDelay={d2}
                charDelay={0.018}
                className="text-lg text-terminal-accent text-glow font-semibold md:text-xl"
              />
            </p>

            <p className="pl-3">
              <TypingLine
                text={line3}
                startDelay={d3}
                charDelay={0.018}
                className="text-terminal-accent-soft"
              />
            </p>

            <p className="pl-3 text-sm text-terminal-muted md:text-[15px]">
              <TypingLine text={line4} startDelay={d4} charDelay={0.012} />
            </p>

            {/* Blinking prompt */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: dEnd }}
              className="pt-2 text-terminal-muted"
            >
              <span className="text-terminal-accent text-glow">➜</span>{" "}
              <span className="text-terminal-accent-soft">~</span>{" "}
              <span className="cursor-blink" />
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
