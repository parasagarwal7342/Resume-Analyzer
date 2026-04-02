import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Shield, Code, Server, Award } from "lucide-react";

export function About() {
  const { data } = usePortfolioData();

  const stats = [
    { label: "Projects Deployed", value: data.personal.stats.projects, icon: Code },
    { label: "Certifications", value: data.personal.stats.certifications, icon: Award },
    { label: "Job Simulations", value: data.personal.stats.jobSimulations, icon: Shield },
    { label: "Years Studying", value: data.personal.stats.yearsStudying, icon: Server },
  ];

  return (
    <section id="about" className="py-24 relative bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px bg-primary/50 w-12" />
              <h2 className="text-3xl font-mono font-bold text-foreground uppercase tracking-widest">
                System.<span className="text-primary">Profile</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.personal.bio}
              </p>
            </motion.div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-card border border-card-border p-6 rounded-lg relative overflow-hidden group hover:border-primary/50 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon size={64} className="text-primary" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold text-foreground mb-2 font-mono">
                      {stat.value}
                      <span className="text-primary">+</span>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
