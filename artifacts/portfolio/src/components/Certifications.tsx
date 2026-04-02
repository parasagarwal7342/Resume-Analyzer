import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function Certifications() {
  const { data } = usePortfolioData();

  return (
    <section id="certifications" className="py-24 relative bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px bg-primary/50 w-12" />
          <h2 className="text-3xl font-mono font-bold text-foreground uppercase tracking-widest">
            Verified.<span className="text-primary">Credentials</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-card-border p-6 rounded-lg relative overflow-hidden group hover:border-primary/50 transition-colors flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{cert.name}</h3>
                  <div className="text-muted-foreground font-mono text-sm">{cert.issuer}</div>
                </div>
              </div>

              <div className="mt-4 mb-6 flex-1">
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map(skill => (
                    <span key={skill} className="text-xs bg-background border border-border px-2 py-1 rounded text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 text-primary">
                  <CheckCircle2 size={14} />
                  <span>ID: {cert.credentialId}</span>
                </div>
                <span>{cert.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
