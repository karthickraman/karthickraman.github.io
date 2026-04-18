"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { personal } from "@/data/resume";

function TypingLine({
  text,
  startDelay,
  charDelay = 0.022,
  className = "",
  wrap = false,
}: {
  text: string;
  startDelay: number;
  charDelay?: number;
  className?: string;
  wrap?: boolean;
}) {
  if (wrap) {
    const words = text.split(" ");
    let charIndex = 0;
    return (
      <span
        className={`text-pretty ${className}`}
        style={{ wordBreak: "normal", overflowWrap: "break-word" }}
      >
        {words.map((word, wi) => {
          const startIdx = charIndex;
          charIndex += word.length + 1;
          return (
            <span key={wi}>
              <span className="inline-block">
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={`${startDelay}-${startIdx + ci}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: startDelay + (startIdx + ci) * charDelay,
                      duration: 0.01,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              {wi < words.length - 1 && (
                <motion.span
                  key={`${startDelay}-sp-${wi}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay:
                      startDelay + (startIdx + word.length) * charDelay,
                    duration: 0.01,
                  }}
                >
                  {" "}
                </motion.span>
              )}
            </span>
          );
        })}
      </span>
    );
  }

  const chars = text.split("");
  return (
    <span className={`inline ${className}`}>
      {chars.map((char, i) => (
        <motion.span
          key={`${startDelay}-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: startDelay + i * charDelay,
            duration: 0.01,
          }}
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

  const d1 = 0.5;
  const d2 = d1 + line1.length * 0.022 + 0.5;
  const d3 = d2 + line2.length * 0.018 + 0.4;
  const d4 = d3 + line3.length * 0.018 + 0.4;
  const dEnd = d4 + line4.length * 0.012 + 0.6;

  return (
    <section
      id="hero"
      className="relative mx-auto max-w-5xl scroll-mt-24 px-4 pb-20 pt-12"
    >
      {/* Ambient glow orbs */}
      <div
        className="glow-orb -top-20 -left-32 h-72 w-72"
        style={{ background: "var(--color-terminal-accent)" }}
      />
      <div
        className="glow-orb -right-24 top-10 h-56 w-56"
        style={{ background: "var(--color-terminal-cyan)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="terminal-card gradient-border overflow-hidden rounded-xl border border-terminal-border bg-terminal-surface"
      >
        {/* Window chrome */}
        <div className="window-chrome">
          <span className="window-dot bg-[#ff5f56]" aria-hidden />
          <span className="window-dot bg-[#ffbd2e]" aria-hidden />
          <span className="window-dot bg-[#27c93f]" aria-hidden />
          <span className="ml-4 flex-1 truncate text-center text-[11px] text-terminal-muted">
            karthick@portfolio — zsh — 80×24
          </span>
        </div>

        <div className="relative p-6 md:p-8">
          {/* Profile image with glow ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="mb-6 flex justify-center md:float-right md:mb-0 md:ml-8"
          >
            <div className="glow-ring rounded-xl border border-terminal-border p-1.5">
              <Image
                src="/profile.png"
                alt={personal.name}
                width={160}
                height={160}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Terminal output */}
          <div className="min-w-0 space-y-4 text-sm leading-relaxed md:text-base">
            <p className="text-terminal-muted">
              <span className="text-terminal-accent text-glow">➜</span>{" "}
              <span className="text-terminal-cyan">~</span>{" "}
              <TypingLine text={line1} startDelay={d1} />
            </p>

            <div className="border-l-2 border-terminal-accent/40 pl-4">
              <p>
                <TypingLine
                  text={line2}
                  startDelay={d2}
                  charDelay={0.018}
                  className="text-2xl text-terminal-accent text-glow font-bold tracking-tight md:text-3xl"
                />
              </p>
            </div>

            <p className="pl-4">
              <TypingLine
                text={line3}
                startDelay={d3}
                charDelay={0.018}
                className="text-terminal-cyan text-glow-cyan text-base md:text-lg"
              />
            </p>

            <p className="pl-4 text-sm text-terminal-muted md:text-[15px]">
              <TypingLine
                text={line4}
                startDelay={d4}
                charDelay={0.012}
                wrap
              />
            </p>

            {/* Blinking prompt */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: dEnd }}
              className="pt-3 text-terminal-muted"
            >
              <span className="text-terminal-accent text-glow">➜</span>{" "}
              <span className="text-terminal-cyan">~</span>{" "}
              <span className="cursor-blink" />
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
