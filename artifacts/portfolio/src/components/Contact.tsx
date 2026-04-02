import { motion } from "framer-motion";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { Mail, Phone, MapPin, Linkedin, Github, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const { data } = usePortfolioData();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(formData.message);
    window.location.href = `mailto:${data.personal.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 relative bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="h-px bg-primary/50 w-12" />
          <h2 className="text-3xl font-mono font-bold text-foreground uppercase tracking-widest">
            Establish.<span className="text-primary">Connection</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">Open Secure Channel</h3>
            <p className="text-muted-foreground mb-8">
              Currently available for select opportunities in offensive security, penetration testing, and strategic engineering. Reach out via the secure channel below or directly via email.
            </p>

            <div className="space-y-6">
              <a href={`mailto:${data.personal.email}`} className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group">
                <div className="w-12 h-12 bg-card border border-border rounded flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70 mb-1">Email Protocol</div>
                  <div className="text-foreground">{data.personal.email}</div>
                </div>
              </a>

              <a href={`tel:${data.personal.phone.replace(/\s+/g, '')}`} className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group">
                <div className="w-12 h-12 bg-card border border-border rounded flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70 mb-1">Voice Comm</div>
                  <div className="text-foreground">{data.personal.phone}</div>
                </div>
              </a>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 bg-card border border-border rounded flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70 mb-1">Coordinates</div>
                  <div className="text-foreground">{data.personal.location}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <a href={data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-card border border-border rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={data.personal.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-card border border-border rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-card-border p-8 rounded-lg relative"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl rounded-full" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Identification</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Return Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Payload (Message)</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm resize-none"
                  placeholder="Enter your message"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors font-mono uppercase tracking-wider text-sm"
              >
                <Send size={16} />
                Transmit Payload
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
