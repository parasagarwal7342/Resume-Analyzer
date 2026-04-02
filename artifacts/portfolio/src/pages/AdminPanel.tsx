import { useState } from "react";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { PortfolioData } from "../data/portfolioData";
import { ShieldAlert, Save, LogOut, RotateCcw, Shield, Terminal } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Link } from "wouter";

const ADMIN_PASSWORD = "paraditi2025";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { data, updateData, resetData } = usePortfolioData();
  const [editData, setEditData] = useState<PortfolioData>(data);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setEditData(data); // Sync state once authenticated
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid credentials.",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  const handleSave = () => {
    updateData(editData);
    toast({
      title: "Settings Updated",
      description: "Portfolio data has been saved to local storage.",
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset to original data? All local changes will be lost.")) {
      resetData();
      setEditData(data); // Will be updated to default on next render, but let's force it visually if needed, though usePortfolioData handles it. 
      // A small timeout ensures the hook's state updates first
      setTimeout(() => window.location.reload(), 100); 
    }
  };

  const updatePersonal = (field: keyof PortfolioData['personal'], value: any) => {
    setEditData({
      ...editData,
      personal: {
        ...editData.personal,
        [field]: value
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="noise-bg" />
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        
        <Link href="/" className="absolute top-8 left-8 text-muted-foreground hover:text-primary font-mono text-sm flex items-center gap-2">
          &lt; Return to Public Site
        </Link>

        <div className="w-full max-w-md bg-card border border-border p-8 rounded-lg shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 border border-primary/50 rounded-full flex items-center justify-center text-primary mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-wider">RESTRICTED ACCESS</h1>
            <p className="text-muted-foreground text-sm font-mono mt-2">Enter admin credentials to proceed</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded px-4 py-3 text-foreground font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                placeholder="Password..."
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded font-mono uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Terminal size={18} /> Authorize
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={20} />
            <span className="font-mono font-bold text-lg">SYSTEM ADMINISTRATION</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleReset} className="text-sm font-mono text-muted-foreground hover:text-destructive flex items-center gap-2 transition-colors">
              <RotateCcw size={16} /> Reset
            </button>
            <button onClick={handleSave} className="text-sm font-mono bg-primary text-primary-foreground px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <Save size={16} /> Save Changes
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-sm font-mono text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors ml-4 border-l border-border pl-4">
              <LogOut size={16} /> Exit
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8 max-w-4xl space-y-8">
        <div className="bg-primary/10 border border-primary/30 p-4 rounded text-sm font-mono text-primary flex items-start gap-3">
          <Terminal size={18} className="shrink-0 mt-0.5" />
          <p>
            Modifications made here are saved to the local browser storage (localStorage) and will override the default portfolioData.ts values. 
            Useful for quick text adjustments before generating PDFs.
          </p>
        </div>

        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono border-b border-border pb-4">Personal Identity</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Full Name</label>
              <input 
                type="text" 
                value={editData.personal.name}
                onChange={(e) => updatePersonal('name', e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Title</label>
              <input 
                type="text" 
                value={editData.personal.title}
                onChange={(e) => updatePersonal('title', e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Tagline</label>
              <input 
                type="text" 
                value={editData.personal.tagline}
                onChange={(e) => updatePersonal('tagline', e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Biography</label>
              <textarea 
                value={editData.personal.bio}
                onChange={(e) => updatePersonal('bio', e.target.value)}
                rows={5}
                className="w-full bg-background border border-border rounded p-2 text-sm font-sans resize-y"
              />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono border-b border-border pb-4">Contact Coordinates</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Email</label>
              <input 
                type="text" 
                value={editData.personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Phone</label>
              <input 
                type="text" 
                value={editData.personal.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Location</label>
              <input 
                type="text" 
                value={editData.personal.location}
                onChange={(e) => updatePersonal('location', e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">LinkedIn URL</label>
              <input 
                type="text" 
                value={editData.personal.linkedin}
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono border-b border-border pb-4">Paraditi Corp Setup</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Company Tagline</label>
              <input 
                type="text" 
                value={editData.paraditi.tagline}
                onChange={(e) => setEditData({...editData, paraditi: {...editData.paraditi, tagline: e.target.value}})}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">Company Description</label>
              <textarea 
                value={editData.paraditi.description}
                onChange={(e) => setEditData({...editData, paraditi: {...editData.paraditi, description: e.target.value}})}
                rows={4}
                className="w-full bg-background border border-border rounded p-2 text-sm font-sans resize-y"
              />
            </div>
          </div>
        </section>

        <div className="text-center text-sm font-mono text-muted-foreground">
          <p>For complex array structures (Projects, Skills, Experience), please edit <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">portfolioData.ts</code> directly.</p>
        </div>
      </main>
    </div>
  );
}
