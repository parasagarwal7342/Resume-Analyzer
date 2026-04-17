import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Zap, Hexagon, Network, Fingerprint } from "lucide-react";

export function Paravion() {
  const { data } = usePortfolioData();

  return (
    <section id="paravion" className="py-32 relative overflow-hidden bg-primary/5">
      {/* Immersive Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 mx-auto bg-card border border-primary/50 flex items-center justify-center rounded-2xl mb-8 shadow-lg rotate-45"
          >
            <Hexagon size={40} className="text-primary -rotate-45" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-foreground tracking-tighter mb-6"
          >
            {data.paravion.name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-primary font-mono tracking-tight mb-8 font-bold"
          >
            {data.paravion.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            {data.paravion.description}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-primary/10 p-8 rounded-xl text-center group hover:border-primary/40 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center border border-primary/20 text-primary mb-6 group-hover:scale-110 transition-transform">
              <Network size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{data.paravion.products[0]}</h3>
            <p className="text-sm text-muted-foreground">Zero-Trust Fraud Prevention for Digital Payments.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-primary/10 p-8 rounded-xl text-center group hover:border-primary/40 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center border border-primary/20 text-primary mb-6 group-hover:scale-110 transition-transform">
              <Fingerprint size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{data.paravion.products[1]}</h3>
            <p className="text-sm text-muted-foreground">AI-Powered Multi-Stage Return Fraud Protection.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-primary/10 p-8 rounded-xl text-center group hover:border-primary/40 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center border border-primary/20 text-primary mb-6 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{data.paravion.products[2]}</h3>
            <p className="text-sm text-muted-foreground">Sovereign AI Intelligence Platform for Finance.</p>
          </motion.div>
        </div>
        
        <div className="mt-20 text-center">
           <a href="#projects" className="inline-flex items-center gap-2 text-primary font-mono hover:underline">
             View full product specifications <Zap size={16} />
           </a>
        </div>

        {/* Legal Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-8 border-t border-primary/10 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-primary/60 mb-3">
            <Fingerprint size={14} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Intellectual Property Protection</span>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground/60 leading-relaxed uppercase tracking-widest text-center px-4">
            Legal Notice: Except for Sahaj, all original ideas, architectural frameworks, and proprietary algorithms of Paravion Corp are strictly Patented and Copyrighted © 2026. Any unauthorized reproduction, adaptation, or distribution will be met with immediate legal action.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
