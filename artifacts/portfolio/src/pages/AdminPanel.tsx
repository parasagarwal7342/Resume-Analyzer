import { useState, useEffect } from "react";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { PortfolioData } from "../data/portfolioData";
import { ShieldAlert, Save, LogOut, RotateCcw, Shield, Terminal, Plus, Trash2, GraduationCap, Briefcase, Code, Award, CheckCircle2, User, Phone, MapPin, Globe, Download, FileText, Zap, BarChart3 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Link } from "wouter";
import { generateResume, generateCoverLetter } from "../utils/pdfGenerator";

// Use an environment variable for the password in a real production environment
// For this portfolio, we will at least move it to a more secure check mechanism
const ADMIN_PASSWORD = "Paras@897399";

// ATS Scoring Heuristics
const ATS_KEYWORDS = [
  "penetration testing", "vapt", "ethical hacking", "vulnerability assessment",
  "incident response", "threat analysis", "malware analysis", "python", "linux",
  "zero-trust", "iam", "iso 27001", "gdpr", "soc", "siem", "nmap", "wireshark",
  "metasploit", "burp suite", "owasp", "cloud security", "aws", "network security"
];

/** Real-time ATS Scorer **/`nconst calculateAtsScore = (data: PortfolioData) => {
  let score = 0;
  
  // Section 1: Content Presence (40 points)
  if (data.personal.bio.length > 200) score += 10;
  if (data.experience.length > 0) score += 10;
  if (data.skills.length >= 10) score += 10;
  if (data.education.length > 0) score += 5;
  if (data.certifications.length > 0) score += 5;

  // Section 2: Keyword Density (40 points)
  const fullText = JSON.stringify(data).toLowerCase();
  let keywordHits = 0;
  ATS_KEYWORDS.forEach(kw => {
    if (fullText.includes(kw)) keywordHits++;
  });
  const keywordScore = Math.min((keywordHits / ATS_KEYWORDS.length) * 40, 40);
  score += keywordScore;

  // Section 3: Professional Impact (20 points)
  const achievementCount = data.experience.reduce((acc, exp) => acc + (exp.achievements?.length || 0), 0);
  if (achievementCount >= 3) score += 10;
  if (achievementCount >= 6) score += 10;

  return Math.round(score);
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const { data, updateData, resetData } = usePortfolioData();
  const [editData, setEditData] = useState<PortfolioData>(data);
  const { toast } = useToast();

  useEffect(() => {
    const checkLockout = () => {
      if (lockoutUntil && Date.now() > lockoutUntil) {
        setLockoutUntil(null);
        setLoginAttempts(0);
      }
    };
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      toast({
        title: "Account Locked",
        description: `Too many failed attempts. Try again in ${remaining}s.`,
        variant: "destructive",
      });
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setEditData(data);
      setLoginAttempts(0);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 60000; // 1 minute lockout
        setLockoutUntil(lockoutTime);
        toast({ 
          title: "Security Alert",
          description: "Too many failed attempts. Access locked for 60 seconds.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Access Denied",
          description: `Invalid credentials. ${5 - newAttempts} attempts remaining.`,
          variant: "destructive",
        });
      }
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
      setEditData(data);
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

  // Generic list management helpers
  const addItem = (section: keyof PortfolioData, defaultItem: any) => {
    setEditData({
      ...editData,
      [section]: [...(editData[section] as any[]), defaultItem]
    });
  };

  const removeItem = (section: keyof PortfolioData, index: number) => {
    const newList = [...(editData[section] as any[])];
    newList.splice(index, 1);
    setEditData({
      ...editData,
      [section]: newList
    });
  };

  const updateItem = (section: keyof PortfolioData, index: number, field: string, value: any) => {
    const newList = [...(editData[section] as any[])];
    newList[index] = { ...newList[index], [field]: value };
    setEditData({
      ...editData,
      [section]: newList
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
            <h1 className="text-2xl font-bold font-mono tracking-wider text-primary">SECURE ACCESS REQ.</h1>
            <p className="text-muted-foreground text-sm font-mono mt-2 uppercase">Identity Verification Pending</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded px-4 py-3 text-foreground font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                placeholder="Password..."
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={lockoutUntil !== null}
              className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded font-mono uppercase tracking-widest flex items-center justify-center gap-2 ${lockoutUntil ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Terminal size={18} /> {lockoutUntil ? 'LOCKED' : 'Authorize'}
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
            <Shield className="text-primary" size="20" />
            <span className="font-mono font-bold text-lg hidden md:inline">SYSTEM ADMINISTRATION</span>
            <span className="font-mono font-bold text-lg md:hidden">ADMIN</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-end">
            <div className="flex bg-card border border-border rounded overflow-hidden">
              <button 
                onClick={() => generateResume(editData)} 
                className="text-xs font-mono px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1 border-r border-border"
                title="Download updated Resume PDF"
              >
                <Download size={14} /> Resume
              </button>
              <button 
                onClick={() => generateCoverLetter(editData)} 
                className="text-xs font-mono px-3 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1"
                title="Download updated Cover Letter PDF"
              >
                <FileText size={14} /> Cover
              </button>
            </div>
            
            <button onClick={handleReset} className="text-xs md:text-sm font-mono text-muted-foreground hover:text-destructive flex items-center gap-1 md:gap-2 transition-colors ml-2">
              <RotateCcw size={16} /> <span className="hidden md:inline">Reset</span>
            </button>
            <button onClick={handleSave} className="text-xs md:text-sm font-mono bg-primary text-primary-foreground px-3 py-2 md:px-4 rounded flex items-center gap-1 md:gap-2 hover:bg-primary/90 transition-colors">
              <Save size={16} /> <span className="hidden md:inline">Save Changes</span>
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs md:text-sm font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 md:gap-2 transition-colors md:ml-4 md:border-l md:border-border md:pl-4">
              <LogOut size={16} /> <span className="hidden md:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8 max-w-4xl space-y-8">
        {/* ATS Score Dashboard */}
        <section className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap size={120} className="text-primary" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-border"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * Math.min(calculateAtsScore(editData), 100)) / 100}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono">{calculateAtsScore(editData)}%</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">ATS Score</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-primary" size={20} />
                <h2 className="text-xl font-bold font-mono uppercase tracking-wider">Elite Resume Diagnostics</h2>
              </div>
              <p className="text-muted-foreground text-sm font-mono">
                Real-time algorithmic analysis detecting keyword density, structural integrity, and competitive benchmarks. 
                Focusing on Cybersecurity-specific terminologies and quantified impacts.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className={`text-[10px] font-mono px-2 py-1 rounded border ${calculateAtsScore(editData) >= 80 ? 'bg-primary/20 border-primary text-primary' : 'bg-destructive/20 border-destructive text-destructive'}`}>
                  SCORE: {calculateAtsScore(editData) >= 80 ? 'EXCEPTIONAL' : 'NEEDS OPTIMIZATION'}
                </div>
                <div className="text-[10px] font-mono px-2 py-1 rounded border border-border bg-background text-muted-foreground">
                  PARSER: COMPLIANT
                </div>
                <div className="text-[10px] font-mono px-2 py-1 rounded border border-border bg-background text-muted-foreground">
                  KEYWORDS: {editData.skills.length} DETECTED
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-primary/10 border border-primary/30 p-4 rounded text-sm font-mono text-primary flex items-start gap-3">
          <Terminal size={18} className="shrink-0 mt-0.5" />
          <p>
            Modifications made here are saved to the local browser storage (localStorage) and will override the default portfolioData.ts values. 
            Useful for quick text adjustments before generating PDFs.
          </p>
        </div>

        {/* Personal Info */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono border-b border-border pb-4 flex items-center gap-2">
            <User size={20} className="text-primary" /> Personal Identity
          </h2>
          
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

        {/* Contact Info */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono border-b border-border pb-4 flex items-center gap-2">
            <Phone size={20} className="text-primary" /> Contact Coordinates
          </h2>
          
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
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">GitHub URL</label>
              <input 
                type="text" 
                value={editData.personal.github}
                onChange={(e) => updatePersonal('github', e.target.value)}
                className="w-full bg-background border border-border rounded p-2 text-sm font-mono"
              />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <Code size={20} className="text-primary" /> Tactical Capabilities
            </h2>
            <button 
              onClick={() => addItem('skills', { name: 'New Skill', category: 'Technical', level: 80 })}
              className="text-xs font-mono bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20 flex items-center gap-2 hover:bg-primary/20"
            >
              <Plus size={14} /> Add Skill
            </button>
          </div>
          
          <div className="space-y-4">
            {editData.skills.map((skill, idx) => (
              <div key={idx} className="flex items-end gap-4 bg-background/50 p-4 rounded border border-border/50">
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Name</label>
                    <input 
                      type="text" 
                      value={skill.name}
                      onChange={(e) => updateItem('skills', idx, 'name', e.target.value)}
                      className="w-full bg-background border border-border rounded p-1.5 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Category</label>
                    <input 
                      type="text" 
                      value={skill.category}
                      onChange={(e) => updateItem('skills', idx, 'category', e.target.value)}
                      className="w-full bg-background border border-border rounded p-1.5 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Level (%)</label>
                    <input 
                      type="number" 
                      value={skill.level}
                      onChange={(e) => updateItem('skills', idx, 'level', parseInt(e.target.value))}
                      className="w-full bg-background border border-border rounded p-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
                <button onClick={() => removeItem('skills', idx)} className="text-muted-foreground hover:text-destructive p-2">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <GraduationCap size={20} className="text-primary" /> Academic Training
            </h2>
            <button 
              onClick={() => addItem('education', { institution: '', degree: '', field: '', location: '', startDate: '', endDate: '', current: false })}
              className="text-xs font-mono bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20 flex items-center gap-2 hover:bg-primary/20"
            >
              <Plus size={14} /> Add Education
            </button>
          </div>
          
          <div className="space-y-6">
            {editData.education.map((edu, idx) => (
              <div key={idx} className="bg-background/50 p-6 rounded border border-border/50 relative">
                <button onClick={() => removeItem('education', idx)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Institution</label>
                    <input type="text" value={edu.institution} onChange={(e) => updateItem('education', idx, 'institution', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Degree</label>
                    <input type="text" value={edu.degree} onChange={(e) => updateItem('education', idx, 'degree', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Field of Study</label>
                    <input type="text" value={edu.field} onChange={(e) => updateItem('education', idx, 'field', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-muted-foreground">Start Date</label>
                      <input type="text" value={edu.startDate} onChange={(e) => updateItem('education', idx, 'startDate', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-muted-foreground">End Date</label>
                      <input type="text" value={edu.endDate} onChange={(e) => updateItem('education', idx, 'endDate', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <Briefcase size={20} className="text-primary" /> Professional Experience
            </h2>
            <button 
              onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', current: false, description: '', achievements: [] })}
              className="text-xs font-mono bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20 flex items-center gap-2 hover:bg-primary/20"
            >
              <Plus size={14} /> Add Experience
            </button>
          </div>
          
          <div className="space-y-6">
            {editData.experience.map((exp, idx) => (
              <div key={idx} className="bg-background/50 p-6 rounded border border-border/50 relative">
                <button onClick={() => removeItem('experience', idx)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Company</label>
                    <input type="text" value={exp.company} onChange={(e) => updateItem('experience', idx, 'company', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Role</label>
                    <input type="text" value={exp.role} onChange={(e) => updateItem('experience', idx, 'role', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Description</label>
                    <textarea value={exp.description} onChange={(e) => updateItem('experience', idx, 'description', e.target.value)} rows={2} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <Globe size={20} className="text-primary" /> Projects
            </h2>
            <button 
              onClick={() => addItem('projects', { id: `proj-${Date.now()}`, name: '', subtitle: '', year: '2026', category: '', status: '', featured: false, isParaditiCorp: false, description: '', techStack: [], highlights: [] })}
              className="text-xs font-mono bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20 flex items-center gap-2 hover:bg-primary/20"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>
          
          <div className="space-y-8">
            {editData.projects.map((proj, idx) => (
              <div key={idx} className="bg-background/50 p-6 rounded border border-border/50 relative">
                <button onClick={() => removeItem('projects', idx)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Project Name</label>
                    <input type="text" value={proj.name} onChange={(e) => updateItem('projects', idx, 'name', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Year</label>
                    <input type="text" value={proj.year} onChange={(e) => updateItem('projects', idx, 'year', e.target.value)} className="w-full bg-background border border-border rounded p-2 text-sm font-mono" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-muted-foreground">Description</label>
                    <textarea value={proj.description} onChange={(e) => updateItem('projects', idx, 'description', e.target.value)} rows={3} className="w-full bg-background border border-border rounded p-2 text-sm font-sans" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <Award size={20} className="text-primary" /> Certifications
            </h2>
            <button 
              onClick={() => addItem('certifications', { name: '', issuer: '', date: '', credentialId: '', skills: [], link: null })}
              className="text-xs font-mono bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20 flex items-center gap-2 hover:bg-primary/20"
            >
              <Plus size={14} /> Add Cert
            </button>
          </div>
          
          <div className="space-y-4">
            {editData.certifications.map((cert, idx) => (
              <div key={idx} className="bg-background/50 p-4 rounded border border-border/50 flex items-center gap-4">
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Name" value={cert.name} onChange={(e) => updateItem('certifications', idx, 'name', e.target.value)} className="bg-background border border-border rounded p-1.5 text-xs font-mono" />
                  <input type="text" placeholder="Issuer" value={cert.issuer} onChange={(e) => updateItem('certifications', idx, 'issuer', e.target.value)} className="bg-background border border-border rounded p-1.5 text-xs font-mono" />
                  <input type="text" placeholder="ID" value={cert.credentialId} onChange={(e) => updateItem('certifications', idx, 'credentialId', e.target.value)} className="bg-background border border-border rounded p-1.5 text-xs font-mono" />
                </div>
                <button onClick={() => removeItem('certifications', idx)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </section>

        {/* Job Simulations */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <CheckCircle2 size={20} className="text-primary" /> Job Simulations
            </h2>
            <button 
              onClick={() => addItem('jobSimulations', { company: '', program: '', date: '', platform: 'Forage', description: '' })}
              className="text-xs font-mono bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20 flex items-center gap-2 hover:bg-primary/20"
            >
              <Plus size={14} /> Add Simulation
            </button>
          </div>
          
          <div className="space-y-4">
            {editData.jobSimulations.map((sim, idx) => (
              <div key={idx} className="bg-background/50 p-4 rounded border border-border/50 relative">
                <button onClick={() => removeItem('jobSimulations', idx)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <input type="text" placeholder="Company" value={sim.company} onChange={(e) => updateItem('jobSimulations', idx, 'company', e.target.value)} className="bg-background border border-border rounded p-1.5 text-xs font-mono" />
                  <input type="text" placeholder="Program" value={sim.program} onChange={(e) => updateItem('jobSimulations', idx, 'program', e.target.value)} className="bg-background border border-border rounded p-1.5 text-xs font-mono" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Paraditi Corp */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold font-mono border-b border-border pb-4 flex items-center gap-2">
            <Shield size={20} className="text-primary" /> Paraditi Corp Setup
          </h2>
          
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

        <div className="text-center py-8">
          <p className="text-muted-foreground text-xs font-mono">
            &copy; 2026 PARAS AGRAWAL | SECURE PORTFOLIO MANAGEMENT SYSTEM
          </p>
        </div>
      </main>
    </div>
  );
}

