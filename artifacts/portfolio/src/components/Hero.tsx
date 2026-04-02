import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, ChevronRight, Terminal } from "lucide-react";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { generateResume, generateCoverLetter } from "../utils/pdfGenerator";

export function Hero() {
  const { data } = usePortfolioData();
  const [roleIndex, setRoleIndex] = useState(0);

  // Hidden check based on URL query parameter ?admin=true
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % data.personal.roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data.personal.roles.length]);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 border border-primary/30 text-primary">
              <Terminal size={16} />
            </div>
            <span className="font-mono text-primary font-medium tracking-widest uppercase text-sm">
              System Access Granted
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tighter text-foreground mb-4"
          >
            {data.personal.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-12 md:h-16 flex items-center mb-8"
          >
            <span className="text-xl md:text-3xl font-mono text-muted-foreground">
              &gt;{" "}
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-primary glow-cyan inline-block"
              >
                {data.personal.roles[roleIndex]}
              </motion.span>
              <span className="animate-pulse">_</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            {data.personal.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            {isAdmin && (
              <>
                <button
                  onClick={() => generateResume(data)}
                  className="group relative px-8 py-4 bg-primary text-primary-foreground font-mono font-bold uppercase tracking-wider overflow-hidden rounded-sm"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2">
                    <Download size={18} />
                    Download Resume
                  </span>
                </button>

                <button
                  onClick={() => generateCoverLetter(data)}
                  className="px-8 py-4 border border-primary/50 text-primary font-mono font-bold uppercase tracking-wider hover:bg-primary/10 transition-colors rounded-sm flex items-center gap-2"
                >
                  <Download size={18} />
                  Cover Letter
                </button>
              </>
            )}

            <a
              href="#projects"
              className="px-8 py-4 text-foreground font-mono font-bold uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-2"
            >
              View Operations
              <ChevronRight size={18} />
            </a>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 animate-bounce">
        <span className="font-mono text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
}
