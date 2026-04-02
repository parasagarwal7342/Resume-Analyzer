import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Briefcase, Calendar } from "lucide-react";

export function Experience() {
  const { data } = usePortfolioData();

  return (
    <section id="experience" className="py-24 relative bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px bg-primary/50 w-12" />
          <h2 className="text-3xl font-mono font-bold text-foreground uppercase tracking-widest">
            Active.<span className="text-primary">Duty</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {data.experience.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-[1fr_auto_1fr] gap-8 items-start">
                {/* Timeline Line */}
                <div className="hidden md:flex flex-col items-center h-full absolute left-1/2 -translate-x-1/2 top-0 bottom-0">
                  <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20 z-10" />
                  <div className="w-px h-full bg-border -mt-2" />
                </div>

                {/* Mobile Timeline Point */}
                <div className="md:hidden absolute left-0 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
                <div className="md:hidden absolute left-1.5 top-4 bottom-[-3rem] w-px bg-border -translate-x-1/2" />

                {/* Left Side: Meta */}
                <div className="md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-foreground mb-1">{exp.role}</h3>
                  <div className="flex items-center md:justify-end gap-2 text-primary font-mono text-sm mb-2">
                    <Briefcase size={14} />
                    {exp.company}
                  </div>
                  <div className="flex items-center md:justify-end gap-2 text-muted-foreground font-mono text-sm">
                    <Calendar size={14} />
                    {exp.startDate} — {exp.endDate}
                  </div>
                </div>

                <div className="hidden md:block" /> {/* Spacer for timeline */}

                {/* Right Side: Content */}
                <div className="bg-card border border-card-border p-6 rounded-lg">
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/80">
                        <span className="text-primary mt-1">▹</span>
                        <span className="leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
