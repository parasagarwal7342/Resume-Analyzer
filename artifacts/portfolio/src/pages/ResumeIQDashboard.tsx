import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Upload, 
  Search, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  RefreshCcw,
  Plus,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function ResumeIQDashboard() {
  const [activeTab, setActiveTab] = useState("ats");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<any>(null);
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [parsedResumeId, setParsedResumeId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      toast({
        title: "Missing Data",
        description: "Please provide both resume text and job description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Step 1: Parse the resume if not already done
      let resumeId = parsedResumeId;
      if (!resumeId) {
        const parseRes = await fetch("/api/resumes/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: resumeText, fileName: "manual_upload.txt" }),
        });
        const parseData = await parseRes.json();
        resumeId = parseData.id;
        setParsedResumeId(resumeId);
      }

      // Step 2: Get ATS Score
      const scoreRes = await fetch("/api/ats/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobDescription }),
      });
      const scoreData = await scoreRes.json();
      setAtsResult(scoreData);

      toast({
        title: "Analysis Complete",
        description: "Detailed ATS score and semantic analysis generated.",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "An error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/resumes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userData: { text: resumeText }, // In a real app, this would be structured data
          jobDescription,
          template: "modern"
        }),
      });
      const data = await res.json();
      setGeneratedResume(data);
      toast({
        title: "Resume Generated",
        description: "Your optimized resume is ready for review.",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Optimized_Resume.pdf");
      
      toast({
        title: "Download Started",
        description: "Your PDF resume has been generated and is downloading.",
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      <div className="noise-bg opacity-[0.02]" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Header */}
      <nav className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <ShieldCheck className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight glow-cyan">ResumeIQ <span className="text-primary">PRO</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">Enterprise AI Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-sm">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Button>
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">Upgrade Plan</Button>
            <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold">
              PA
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-mono mb-4"
          >
            <Zap size={12} /> SYSTEM READY: v2.4.0-CORE
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-4"
          >
            Intelligence-Driven <br />
            <span className="text-muted-foreground">Career Optimization.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl text-lg"
          >
            A high-fidelity platform specialized in ATS bypassing, semantic resume generation, and deep-match analytics. Built for engineers, by engineers.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
             {[
               { id: 'ats', label: 'ATS Checker', icon: BarChart3 },
               { id: 'generator', label: 'AI Generator', icon: Wand2 },
               { id: 'matcher', label: 'Job Matcher', icon: Search },
               { id: 'portfolio', label: 'Public Portfolio', icon: LayoutDashboard },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm transition-all duration-200 ${
                   activeTab === item.id 
                   ? 'bg-primary/10 border border-primary/20 text-primary shadow-[0_0_20px_rgba(0,240,255,0.05)]' 
                   : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'
                 }`}
               >
                 <item.icon size={18} />
                 {item.label}
               </button>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'ats' && (
                <motion.div
                  key="ats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Panel */}
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="font-mono text-lg flex items-center gap-2">
                          <Upload size={18} className="text-secondary" /> LOAD SOURCE
                        </CardTitle>
                        <CardDescription>Upload resume or paste text to begin analysis</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Resume Content</label>
                          <Textarea 
                            placeholder="Paste your raw resume text here..." 
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            className="bg-background/50 border-border/50 font-sans min-h-[150px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Job Description</label>
                          <Textarea 
                            placeholder="Paste the target JD here..." 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="bg-background/50 border-border/50 font-sans min-h-[150px]"
                          />
                        </div>
                        <Button 
                          onClick={handleAnalyze} 
                          disabled={isAnalyzing}
                          className="w-full bg-primary text-primary-foreground font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                        >
                          {isAnalyzing ? <RefreshCcw className="animate-spin mr-2" /> : <BarChart3 className="mr-2" />}
                          {isAnalyzing ? "Processing..." : "Execute Analysis"}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Result Panel */}
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                        <Badge variant="outline" className="font-mono text-[10px] border-primary/20 text-primary">LIVE SCORE</Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="font-mono text-lg">DIAGNOSTICS</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                        {!atsResult && !isAnalyzing ? (
                          <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-muted/20 border border-border/50 rounded-full flex items-center justify-center text-muted-foreground mx-auto">
                              <FileText size={32} />
                            </div>
                            <p className="text-muted-foreground font-mono text-sm italic">Waiting for input data...</p>
                          </div>
                        ) : isAnalyzing ? (
                          <div className="space-y-6 w-full px-8">
                            <div className="flex justify-between font-mono text-xs">
                              <span className="text-primary animate-pulse">Running Keyword Scan...</span>
                              <span>68%</span>
                            </div>
                            <Progress value={68} className="h-1 bg-muted" />
                            <div className="flex flex-col gap-2">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="h-4 bg-muted animate-pulse rounded opacity-50" />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full space-y-8">
                            <div className="text-center">
                              <div className="relative inline-flex items-center justify-center mb-4">
                                <svg className="w-32 h-32 transform -rotate-90">
                                  <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                                  <circle 
                                    cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                    strokeDasharray={377} 
                                    strokeDashoffset={377 * (1 - atsResult.score/100)}
                                    className="text-primary transition-all duration-1000 ease-out"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-4xl font-bold font-mono">{Math.round(atsResult.score)}</span>
                                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Score</span>
                                </div>
                              </div>
                              <h3 className="font-bold text-lg text-primary">Analysis Complete</h3>
                              <p className="text-sm text-muted-foreground px-8">{atsResult.semanticMatch?.explanation}</p>
                            </div>

                            <div className="space-y-4">
                               <div className="flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
                                 <span>Keyword Density</span>
                                 <span>{Math.round(atsResult.keywordMatch?.densityScore)}%</span>
                               </div>
                               <Progress value={atsResult.keywordMatch?.densityScore} className="h-1" />
                               
                               <div className="flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
                                 <span>Semantic Fit</span>
                                 <span>{Math.round(atsResult.semanticMatch?.fitScore)}%</span>
                               </div>
                               <Progress value={atsResult.semanticMatch?.fitScore} className="h-1" />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Keyword Details */}
                  {atsResult && (
                    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="font-mono text-base flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-green-500" /> KEYWORD ANALYSIS
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                           <h4 className="text-xs font-mono uppercase text-muted-foreground">Matched Skills</h4>
                           <div className="flex flex-wrap gap-2">
                             {atsResult.keywordMatch?.matched?.map((skill: string) => (
                               <Badge key={skill} variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">{skill}</Badge>
                             ))}
                           </div>
                         </div>
                         <div className="space-y-4">
                           <h4 className="text-xs font-mono uppercase text-muted-foreground">Critical Missing</h4>
                           <div className="flex flex-wrap gap-2">
                             {atsResult.keywordMatch?.missing?.map((skill: string) => (
                               <Badge key={skill} variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">{skill}</Badge>
                             ))}
                           </div>
                         </div>
                      </CardContent>
                      <CardHeader className="pt-0">
                        <CardTitle className="font-mono text-base flex items-center gap-2">
                          <AlertCircle size={16} className="text-primary" /> SUGGESTIONS
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {atsResult.improvementSuggestions?.map((s: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1 font-bold">»</span> {s}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}

              {activeTab === 'generator' && (
                <motion.div
                  key="generator"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-mono text-lg flex items-center gap-2">
                        <Wand2 size={18} className="text-primary" /> RESUME SYNTHESIS
                      </CardTitle>
                      <CardDescription>Generate an optimized profile based on your data and target role.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                       <div className="grid md:grid-cols-3 gap-6">
                         {[
                           { name: 'Modern Dark', img: 'modern' },
                           { name: 'Minimalist', img: 'minimal' },
                           { name: 'Executive', img: 'executive' },
                         ].map(temp => (
                           <div key={temp.name} className="group cursor-pointer">
                             <div className="aspect-[3/4] bg-muted/30 border border-border/50 rounded-xl mb-3 flex items-center justify-center group-hover:border-primary/50 transition-all group-hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                               <FileText className="text-muted-foreground" size={40} />
                             </div>
                             <p className="font-mono text-xs text-center uppercase tracking-widest">{temp.name}</p>
                           </div>
                         ))}
                       </div>
                       
                       <div className="space-y-4">
                         <Button 
                           onClick={handleGenerate}
                           disabled={isGenerating}
                           className="w-full h-16 text-lg font-mono uppercase tracking-widest bg-gradient-to-r from-primary to-purple-600 border-none shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                         >
                           {isGenerating ? <RefreshCcw className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                           {isGenerating ? "Synthesizing..." : "Start Synthesis"}
                         </Button>
                       </div>

                       {generatedResume && (
                         <div className="mt-12 space-y-6">
                           <div className="flex items-center gap-3 mb-4">
                             <div className="h-px flex-1 bg-border" />
                             <span className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest">Synthesis Result</span>
                             <div className="h-px flex-1 bg-border" />
                           </div>
                           
                           <Card className="bg-primary/5 border-primary/20">
                             <CardHeader>
                               <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
                                 <Zap size={14} /> OPTIMIZATION LOG
                               </CardTitle>
                             </CardHeader>
                             <CardContent className="text-sm text-muted-foreground leading-relaxed">
                               {generatedResume.optimizedDescription}
                             </CardContent>
                           </Card>

                           <div id="resume-preview" className="bg-background/80 border border-border rounded-2xl p-8 font-serif shadow-2xl relative group/resume">
                             <div className="absolute top-4 right-4 opacity-0 group-hover/resume:opacity-100 transition-opacity">
                               <Button onClick={downloadResume} size="sm" variant="outline" className="font-mono text-[10px] gap-2">
                                 <Plus size={14} /> EXPORT PDF
                               </Button>
                             </div>
                             <h3 className="text-2xl font-bold mb-4">{generatedResume.content?.contact?.name}</h3>
                             <p className="text-muted-foreground mb-8">{generatedResume.content?.summary}</p>
                             <div className="space-y-6">
                               <h4 className="text-sm font-mono uppercase text-primary tracking-widest border-b border-primary/20 pb-2">Experience</h4>
                               {generatedResume.content?.experience?.map((exp: any, i: number) => (
                                 <div key={i} className="space-y-1">
                                   <div className="flex justify-between font-bold">
                                     <span>{exp.title} @ {exp.company}</span>
                                     <span className="font-mono text-xs">{exp.startDate} - {exp.endDate}</span>
                                   </div>
                                   <p className="text-sm text-muted-foreground">{exp.description}</p>
                                   <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 mt-2">
                                      {exp.achievements?.map((a: string, j: number) => <li key={j}>{a}</li>)}
                                   </ul>
                                 </div>
                               ))}
                             </div>
                           </div>
                         </div>
                       )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-border/50 text-center relative z-10">
        <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] uppercase">
          &copy; 2026 ResumeIQ Pro | Powered by P Λ R Λ D I T I Intelligence
        </p>
      </footer>
    </div>
  );
}
