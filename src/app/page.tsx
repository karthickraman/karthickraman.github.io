import { Navbar } from "@/components/Navbar";
import { Whoami } from "@/components/Whoami";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function SectionDivider() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="section-divider" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-terminal-bg pb-16 font-mono text-terminal-body">
      <a
        href="#whoami"
        className="fixed left-4 top-0 z-[100] -translate-y-full rounded-md border border-terminal-accent/40 bg-terminal-surface px-4 py-2 text-sm font-medium text-terminal-accent shadow-lg transition-transform focus:translate-y-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent focus-visible:ring-offset-2 focus-visible:ring-offset-terminal-bg"
      >
        Skip to content
      </a>
      <Navbar />
      <Whoami />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Contact />
      <Footer />
    </main>
  );
}
