import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { Experience } from "../components/Experience";
import { Projects } from "../components/Projects";
import { Paraditi } from "../components/Paraditi";
import { Education } from "../components/Education";
import { Certifications } from "../components/Certifications";
import { JobSimulations } from "../components/JobSimulations";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="noise-bg" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Paraditi />
        <Certifications />
        <JobSimulations />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
