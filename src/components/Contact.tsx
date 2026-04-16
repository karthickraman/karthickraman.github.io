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
    const subject = encodeURIComponent(form.subject || `Message from ${form.name}`);
    const body = encodeURIComponent(`From: ${form.name}\n\n${form.message}`);
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
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
            ./contact.sh — send a message
          </span>
        </div>
        <div className="p-6">
          {/* Links */}
          <p className="text-xs text-terminal-muted mb-4">
            <span className="text-terminal-accent text-glow">$</span> cat ~/.contact
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <a
              href={`mailto:${personal.email}`}
              className="group flex items-center gap-2 rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-accent-soft transition hover:border-terminal-accent hover:text-terminal-accent"
            >
              <HiOutlineEnvelope className="size-4 shrink-0" aria-hidden />
              <span className="break-all">{personal.email}</span>
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-accent-soft transition hover:border-terminal-accent hover:text-terminal-accent"
            >
              <FaLinkedinIn className="size-3.5" aria-hidden />
              LinkedIn
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-xs text-terminal-accent-soft transition hover:border-terminal-accent hover:text-terminal-accent"
            >
              <FaGithub className="size-3.5" aria-hidden />
              GitHub
            </a>
          </div>

          {/* Mail form */}
          <div className="border-t border-dashed border-terminal-border pt-6">
            <p className="text-xs text-terminal-muted mb-4">
              <span className="text-terminal-accent text-glow">$</span>{" "}
              mail -s &quot;Subject&quot; {personal.email}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-terminal-yellow shrink-0">From:</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 rounded border border-terminal-border bg-terminal-bg px-3 py-1.5 text-sm text-terminal-body placeholder-terminal-muted/50 outline-none focus:border-terminal-accent transition-colors"
                  placeholder="your name"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-terminal-yellow shrink-0">Subject:</span>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="flex-1 rounded border border-terminal-border bg-terminal-bg px-3 py-1.5 text-sm text-terminal-body placeholder-terminal-muted/50 outline-none focus:border-terminal-accent transition-colors"
                  placeholder="let's connect"
                />
              </div>
              <div>
                <p className="text-sm text-terminal-yellow mb-1.5">Body:</p>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-sm text-terminal-body placeholder-terminal-muted/50 outline-none focus:border-terminal-accent transition-colors resize-none"
                  placeholder="your message here..."
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded border border-terminal-accent bg-terminal-accent/10 px-4 py-1.5 text-sm font-semibold text-terminal-accent transition hover:bg-terminal-accent/20 hover:shadow-[0_0_12px_rgba(0,255,65,0.15)]"
                >
                  send &crarr;
                </button>
                <span className="text-xs text-terminal-muted">
                  opens your mail client
                </span>
              </div>
            </form>
          </div>

          {/* Prompt */}
          <p className="mt-8 text-sm text-terminal-muted">
            <span className="text-terminal-accent text-glow">➜</span>{" "}
            <span className="text-terminal-accent-soft">~</span>{" "}
            <span className="cursor-blink" />
          </p>
        </div>
      </motion.div>
    </section>
  );
}
