"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { personal } from "@/data/resume";

const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ||
  "e66254f9-f72c-441a-8cc4-77be627b187a";

type Status = "idle" | "sending" | "success" | "error";

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

function field(name: FormDataEntryValue | null): string {
  if (name == null) return "";
  return String(name).trim();
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_KEY);

    const name = field(formData.get("name"));
    const topic = field(formData.get("Subject"));
    formData.append(
      "subject",
      topic ? `Portfolio: ${topic}` : `Portfolio message from ${name || "visitor"}`
    );

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const raw = await res.text();
      let data: Web3FormsResponse = {};
      try {
        data = JSON.parse(raw) as Web3FormsResponse;
      } catch {
        setStatus("error");
        return;
      }

      if (!res.ok || !data.success) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
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
          <h2 className="sr-only">Contact</h2>
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
            <input type="hidden" name="from_name" value="Portfolio Contact Form" />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />
            <div className="flex flex-wrap items-center gap-3 text-sm sm:flex-nowrap">
              <label
                htmlFor="contact-name"
                className="w-16 shrink-0 text-right text-terminal-yellow"
              >
                From:
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                className="min-h-11 flex-1 rounded-lg border border-terminal-border bg-terminal-bg/60 px-3 py-2 text-sm text-terminal-body placeholder-terminal-muted/40 outline-none transition-all duration-200"
                placeholder="your name"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm sm:flex-nowrap">
              <label
                htmlFor="contact-email"
                className="w-16 shrink-0 text-right text-terminal-yellow"
              >
                Email:
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                className="min-h-11 flex-1 rounded-lg border border-terminal-border bg-terminal-bg/60 px-3 py-2 text-sm text-terminal-body placeholder-terminal-muted/40 outline-none transition-all duration-200"
                placeholder="your@email.com"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm sm:flex-nowrap">
              <label
                htmlFor="contact-subject"
                className="w-16 shrink-0 text-right text-terminal-yellow"
              >
                Subject:
              </label>
              <input
                id="contact-subject"
                type="text"
                name="Subject"
                className="min-h-11 flex-1 rounded-lg border border-terminal-border bg-terminal-bg/60 px-3 py-2 text-sm text-terminal-body placeholder-terminal-muted/40 outline-none transition-all duration-200"
                placeholder="let's connect"
              />
            </div>
            <div className="flex flex-wrap gap-3 text-sm sm:flex-nowrap">
              <label
                htmlFor="contact-message"
                className="mt-2 w-16 shrink-0 text-right text-terminal-yellow sm:mt-2"
              >
                Message:
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                autoComplete="off"
                className="min-h-24 flex-1 resize-none rounded-lg border border-terminal-border bg-terminal-bg/60 px-3 py-2 text-sm text-terminal-body placeholder-terminal-muted/40 outline-none transition-all duration-200"
                placeholder="your message here..."
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 pl-0 sm:pl-[76px]">
              <button
                type="submit"
                disabled={status === "sending"}
                className="min-h-11 rounded-lg border border-terminal-accent/40 bg-terminal-accent/10 px-5 py-2 text-sm font-semibold text-terminal-accent transition-all duration-200 hover:bg-terminal-accent/20 hover:border-terminal-accent/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "sending" ? "sending..." : "send \u21B5"}
              </button>
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="text-xs"
              >
                {status === "success" && (
                  <span className="text-terminal-accent">
                    message sent successfully!
                  </span>
                )}
                {status === "error" && (
                  <span className="text-red-400">
                    failed to send — please try again
                  </span>
                )}
                {status === "idle" && (
                  <span className="text-terminal-muted/60">
                    sends directly to my inbox
                  </span>
                )}
                {status === "sending" && (
                  <span className="text-terminal-muted/60">sending…</span>
                )}
              </div>
            </div>
          </form>

          {/* Prompt */}
          <p className="mt-8 text-sm text-terminal-muted" aria-hidden="true">
            <span className="text-terminal-accent text-glow">➜</span>{" "}
            <span className="text-terminal-cyan">~</span>{" "}
            <span className="cursor-blink" />
          </p>
        </div>
      </motion.div>
    </section>
  );
}
