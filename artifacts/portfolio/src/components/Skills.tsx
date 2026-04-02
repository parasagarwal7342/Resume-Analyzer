import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";

export function Skills() {
  const { data } = usePortfolioData();

  const categories = Array.from(new Set(data.skills.map((s) => s.category)));

  return (
    <section id="skills" className="py-24 relative bg-card/30">
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
            Tactical.<span className="text-primary">Capabilities</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-card-border p-8 rounded-lg"
            >
              <h3 className="text-xl font-mono font-bold text-primary mb-6 flex items-center gap-2">
                <span className="text-muted-foreground/50">#</span> {category}
              </h3>
              <div className="space-y-6">
                {data.skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-2 font-mono">
                        <span className="text-foreground">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full relative"
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
