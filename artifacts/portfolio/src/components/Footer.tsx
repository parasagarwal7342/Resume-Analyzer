import { usePortfolioData } from "../hooks/usePortfolioData";
import { Github, ExternalLink, Shield } from "lucide-react";

export function Footer() {
  const { data } = usePortfolioData();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card py-12 border-t border-border relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary/10 rounded border border-primary/30 flex items-center justify-center text-primary">
                <Shield size={18} />
              </div>
              <span className="font-mono font-bold text-xl tracking-tight text-foreground">
                PARAS<span className="text-primary">.AGRAWAL</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              {data.personal.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-foreground mb-4 uppercase tracking-wider text-sm">Links</h4>
            <ul className="space-y-2 font-mono text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#projects" className="hover:text-primary transition-colors">Projects</a></li>
              <li><a href="#paravion" className="hover:text-primary transition-colors">Paravion Tech</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-foreground mb-4 uppercase tracking-wider text-sm">Connect</h4>
            <ul className="space-y-2 font-mono text-sm text-muted-foreground">
              <li>
                <a href={data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <ExternalLink size={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a href={data.personal.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Github size={14} /> GitHub
                </a>
              </li>
              <li>
                <a href={`mailto:${data.personal.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <ExternalLink size={14} /> Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <p>© {year} Paras Agrawal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Status: <span className="text-primary">Online</span></span>
            <span>Location: {data.personal.location.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
