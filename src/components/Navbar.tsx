"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const MotionLink = motion(Link);

interface ScrollLink {
  kind: "scroll";
  id: string;
  label: string;
}

interface RouteLink {
  kind: "route";
  href: string;
  label: string;
  /** When true, mark active for any path that starts with this href. */
  matchPrefix?: boolean;
}

type NavLink = ScrollLink | RouteLink;

const links: NavLink[] = [
  { kind: "scroll", id: "whoami", label: "whoami" },
  { kind: "scroll", id: "about", label: "man about" },
  { kind: "scroll", id: "skills", label: "tree skills" },
  { kind: "scroll", id: "experience", label: "git log" },
  { kind: "scroll", id: "projects", label: "ls projects" },
  { kind: "route", href: "/tools/", label: "ls tools", matchPrefix: true },
  { kind: "scroll", id: "contact", label: "contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion() ?? false;
  const isHome = pathname === "/" || pathname === "";
  const [active, setActive] = useState("whoami");
  const headerRef = useRef<HTMLElement | null>(null);
  const scrollSpyOffsetRef = useRef(128);
  const lockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const updateOffset = () => {
      scrollSpyOffsetRef.current =
        Math.ceil(el.getBoundingClientRect().height) + 10;
    };

    updateOffset();
    const ro = new ResizeObserver(updateOffset);
    ro.observe(el);
    window.addEventListener("resize", updateOffset);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  useEffect(() => {
    if (!isHome) return;
    let raf = 0;
    const ids = links
      .filter((l): l is ScrollLink => l.kind === "scroll")
      .map((l) => l.id);

    const handleScroll = () => {
      if (lockedRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = scrollSpyOffsetRef.current;
        let next = "whoami";
        for (let i = ids.length - 1; i >= 0; i--) {
          const el = document.getElementById(ids[i]);
          if (el && el.getBoundingClientRect().top <= y) {
            next = ids[i];
            break;
          }
        }
        setActive((prev) => (prev === next ? prev : next));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  const scrollTo = useCallback(
    (id: string) => {
      // Off the home page → route home with the section in the hash
      // and let the browser handle the in-page scroll on landing.
      if (!isHome) {
        router.push(`/#${id}`);
        return;
      }
      setActive(id);
      lockedRef.current = true;
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      lockTimerRef.current = setTimeout(() => {
        lockedRef.current = false;
      }, 1000);
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(id)?.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    },
    [isHome, router],
  );

  const isLinkActive = useCallback(
    (link: NavLink): boolean => {
      if (link.kind === "scroll") {
        return isHome && active === link.id;
      }
      // Normalize trailing slashes / .html suffix so that "/tools",
      // "/tools/", "/tools/jwt-decoder/", "/tools.html" all match a
      // route entry whose href is "/tools/".
      const normalize = (s: string) =>
        s.replace(/\.html$/, "").replace(/\/$/, "");
      const here = normalize(pathname);
      const target = normalize(link.href);
      if (link.matchPrefix) {
        return here === target || here.startsWith(`${target}/`);
      }
      return here === target;
    },
    [active, isHome, pathname],
  );

  return (
    <motion.header
      ref={headerRef}
      initial={reduceMotion ? false : { opacity: 1, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="glass sticky top-0 z-50 border-b border-terminal-border/60 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:pt-[max(1.25rem,env(safe-area-inset-top,0px))]"
    >
      <div className="mx-auto max-w-5xl pt-5 pb-3 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pt-6 sm:pb-4">
        <div className="mb-4 flex min-w-0 items-center gap-2 text-xs text-terminal-muted sm:mb-5">
          <span className="min-w-0 flex-1 truncate font-mono">
            <span className="text-terminal-accent text-glow">$</span>
            {" "}
            <span className="text-terminal-body/80">exec portfolio-nav</span>
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-accent animate-pulse" />
            <span className="hidden text-terminal-accent/60 text-[10px] sm:inline">
              session active
            </span>
          </span>
        </div>
        <nav
          className="cmd-scroll flex touch-pan-x items-center gap-2 overflow-x-auto scroll-px-2 pb-0.5 sm:gap-2.5 sm:scroll-px-0 sm:pb-1"
          aria-label="Primary — scroll horizontally on small screens"
        >
          {links.map((link, i) => {
            const isActive = isLinkActive(link);
            const baseClass = `inline-flex min-h-11 shrink-0 items-center rounded-md border px-3.5 py-2.5 text-left text-xs transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent sm:px-4 sm:py-3 ${
              isActive
                ? "nav-active"
                : "border-terminal-border bg-terminal-surface/60 text-terminal-muted hover:border-terminal-accent/40 hover:bg-terminal-surface hover:text-terminal-accent-soft"
            }`;
            const motionProps = {
              initial: reduceMotion ? false : { opacity: 1, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.06 + i * 0.03, duration: 0.28 },
            } as const;
            const inner = (
              <span className="font-mono">
                <span className="text-terminal-muted/50">$</span>
                {" "}
                <span>{link.label}</span>
              </span>
            );
            const key = link.kind === "scroll" ? link.id : link.href;
            if (link.kind === "route") {
              return (
                <MotionLink
                  key={key}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={baseClass}
                  {...motionProps}
                >
                  {inner}
                </MotionLink>
              );
            }
            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => scrollTo(link.id)}
                {...motionProps}
                aria-current={isActive ? "true" : undefined}
                className={baseClass}
              >
                {inner}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
