import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { GraduationCap, MapPin } from "lucide-react";

export function Education() {
  const { data } = usePortfolioData();

  return (
    <section id="education" className="py-24 relative bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px bg-primary/50 w-12" />
          <h2 className="text-3xl font-mono font-bold text-foreground uppercase tracking-widest">
            Academic.<span className="text-primary">Training</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.education.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-card-border p-6 rounded-lg relative overflow-hidden group hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{edu.degree}</h3>
                  <p className="text-primary font-mono text-sm">{edu.field}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-muted-foreground uppercase mb-1">
                    {edu.startDate} — {edu.endDate}
                  </div>
                  {edu.current && (
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded border border-primary/20">
                      In Progress
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  {edu.institution}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {edu.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
