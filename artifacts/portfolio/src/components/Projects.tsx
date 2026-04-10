import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { ExternalLink, Github, Database, Smartphone, Globe, Cloud } from "lucide-react";

export function Projects() {
  const { data } = usePortfolioData();

  return (
    <section id="projects" className="py-24 relative bg-card/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px bg-primary/50 w-12" />
          <h2 className="text-3xl font-mono font-bold text-foreground uppercase tracking-widest">
            Deployed.<span className="text-primary">Systems</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {data.projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-card border ${project.isParaditiCorp ? 'border-primary/50' : 'border-card-border'} p-8 rounded-lg relative overflow-hidden group hover:border-primary transition-colors flex flex-col h-full`}
            >
              {project.isParaditiCorp && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 font-mono uppercase tracking-wider rounded-bl-lg z-10">
                  Paraditi Corp
                </div>
              )}
              
              <div className="mb-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-foreground font-sans tracking-tight">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase">
                    <span className={project.status === "Developed" ? "text-green-400" : "text-amber-400"}>
                      [{project.status}]
                    </span>
                    <span>{project.year}</span>
                  </div>
                </div>
                <p className="text-primary font-mono text-sm mb-4 tracking-wide">{project.subtitle}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="space-y-2 mb-6">
                  {project.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="text-primary mt-1 text-xs">▹</span>
                      <span className="leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-background border border-border text-xs font-mono text-muted-foreground rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4 border-t border-border/50">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
                      <Github size={16} /> Source Code
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  {!project.github && !project.demo && (
                    <span className="flex items-center gap-2 text-sm font-mono text-muted-foreground/50 cursor-not-allowed">
                      <ExternalLink size={16} /> Restricted Access
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
