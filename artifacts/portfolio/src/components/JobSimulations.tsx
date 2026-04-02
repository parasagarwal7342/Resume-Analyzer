import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Building2, Activity } from "lucide-react";

export function JobSimulations() {
  const { data } = usePortfolioData();

  return (
    <section id="simulations" className="py-24 relative bg-background">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px bg-primary/50 w-12" />
          <h2 className="text-3xl font-mono font-bold text-foreground uppercase tracking-widest">
            Field.<span className="text-primary">Simulations</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.jobSimulations.map((sim, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card/50 border border-card-border p-5 rounded-lg hover:bg-card hover:border-primary/30 transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Building2 size={16} className="text-primary" />
                  {sim.company}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase bg-background px-2 py-0.5 rounded border border-border">
                  {sim.platform}
                </span>
              </div>
              
              <h3 className="text-sm font-medium text-foreground mb-3 leading-snug">
                {sim.program}
              </h3>
              
              <p className="text-xs text-muted-foreground mb-4 flex-1">
                {sim.description}
              </p>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between mt-auto">
                <span className="text-xs font-mono text-muted-foreground/70">{sim.date}</span>
                <Activity size={14} className="text-primary/50" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
