"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { personal } from "@/data/resume";

export function Contact() {
  const [form, setForm] = useState({ name: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      form.subject || `Message from ${form.name}`
    );
    const body = encodeURIComponent(`From: ${form.name}\n\n${form.message}`);
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-5xl scroll-mt-24 px-4 py-16"
    >
      {/* Ambient glow */}
      <div
        className="glow-orb -bottom-20 left-1/4 h-48 w-48"
        style={{ background: "var(--color-terminal-cyan)" }}
      />

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
            ./contact.sh — send a message
          </span>
        </div>

        <div className="p-6 md:p-8">
          {/* Links */}
          <p className="mb-4 text-xs text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span> cat
            ~/.contact
          </p>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${personal.email}`}
              className="group flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-bg/60 px-4 py-2.5 text-xs text-terminal-accent-soft transition-all duration-200 hover:border-terminal-accent/30 hover:text-terminal-accent hover:shadow-[0_0_20px_rgba(0,255,65,0.06)]"
            >
              <HiOutlineEnvelope
                className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                aria-hidden
              />
              <span className="break-all">{personal.email}</span>
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-bg/60 px-4 py-2.5 text-xs text-terminal-accent-soft transition-all duration-200 hover:border-terminal-blue/30 hover:text-terminal-blue hover:shadow-[0_0_20px_rgba(121,192,255,0.06)]"
            >
              <FaLinkedinIn
                className="size-3.5 transition-transform duration-200 group-hover:scale-110"
                aria-hidden
              />
              LinkedIn
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-terminal-border bg-terminal-bg/60 px-4 py-2.5 text-xs text-terminal-accent-soft transition-all duration-200 hover:border-terminal-purple/30 hover:text-terminal-purple hover:shadow-[0_0_20px_rgba(179,146,240,0.06)]"
            >
              <FaGithub
                className="size-3.5 transition-transform duration-200 group-hover:scale-110"
                aria-hidden
              />
              GitHub
            </a>
          </div>

          {/* Mail form */}
          <div className="section-divider mb-6" />
          <p className="mb-4 text-xs text-terminal-muted">
            <span className="text-terminal-accent text-glow">$</span> mail -s
            &quot;Subject&quot; {personal.email}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-16 shrink-0 text-right text-terminal-yellow">
                From:
              </span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="flex-1 rounded-lg border border-terminal-border bg-terminal-bg/60 px-3 py-2 text-sm text-terminal-body placeholder-terminal-muted/40 outline-none transition-all duration-200"
                placeholder="your name"
              />
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-16 shrink-0 text-right text-terminal-yellow">
                Subject:
              </span>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="flex-1 rounded-lg border border-terminal-border bg-terminal-bg/60 px-3 py-2 text-sm text-terminal-body placeholder-terminal-muted/40 outline-none transition-all duration-200"
                placeholder="let's connect"
              />
            </div>
            <div className="flex gap-3 text-sm">
              <span className="mt-2 w-16 shrink-0 text-right text-terminal-yellow">
                Body:
              </span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="flex-1 resize-none rounded-lg border border-terminal-border bg-terminal-bg/60 px-3 py-2 text-sm text-terminal-body placeholder-terminal-muted/40 outline-none transition-all duration-200"
                placeholder="your message here..."
              />
            </div>
            <div className="flex items-center gap-3 pl-[76px]">
              <button
                type="submit"
                className="rounded-lg border border-terminal-accent/40 bg-terminal-accent/10 px-5 py-2 text-sm font-semibold text-terminal-accent transition-all duration-200 hover:bg-terminal-accent/20 hover:border-terminal-accent/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.12)]"
              >
                send &crarr;
              </button>
              <span className="text-xs text-terminal-muted/60">
                opens your mail client
              </span>
            </div>
          </form>

          {/* Prompt */}
          <p className="mt-8 text-sm text-terminal-muted">
            <span className="text-terminal-accent text-glow">➜</span>{" "}
            <span className="text-terminal-cyan">~</span>{" "}
            <span className="cursor-blink" />
          </p>
        </div>
      </motion.div>
    </section>
  );
}
