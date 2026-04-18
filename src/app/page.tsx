import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-terminal-bg pb-16 font-mono text-terminal-body">
      <Navbar />
      <Hero />
      <div className="mx-auto max-w-5xl px-4">
        <div className="section-divider" />
      </div>
      <About />
      <div className="mx-auto max-w-5xl px-4">
        <div className="section-divider" />
      </div>
      <Skills />
      <div className="mx-auto max-w-5xl px-4">
        <div className="section-divider" />
      </div>
      <Experience />
      <div className="mx-auto max-w-5xl px-4">
        <div className="section-divider" />
      </div>
      <Projects />
      <div className="mx-auto max-w-5xl px-4">
        <div className="section-divider" />
      </div>
      <Contact />
      <Footer />
    </main>
  );
}
