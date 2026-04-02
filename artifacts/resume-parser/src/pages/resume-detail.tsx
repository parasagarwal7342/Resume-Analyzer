import { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetResume, 
  useMatchResumeToJob, 
  useDeleteResume, 
  getListResumesQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin,
  Award,
  Trash2,
  Target,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function ResumeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [, setLocation] = useState(); // To simulate navigation if needed
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resume, isLoading, isError } = useGetResume(id, {
    query: { enabled: !!id }
  });

  const [jobDescription, setJobDescription] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const matchMutation = useMatchResumeToJob({
    mutation: {
      onSuccess: () => {
        setIsMatching(false);
      },
      onError: (err) => {
        setIsMatching(false);
        toast({
          title: "Match Analysis Failed",
          description: err?.error || "An error occurred",
          variant: "destructive"
        });
      }
    }
  });

  const deleteMutation = useDeleteResume({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListResumesQueryKey() });
        toast({ title: "Resume deleted" });
        window.location.href = "/resumes"; // Full page reload for simplicity
      }
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Resume not found</h2>
        <Button asChild><Link href="/resumes">Back to Library</Link></Button>
      </div>
    );
  }

  const { parsedData } = resume;
  const name = parsedData.contact?.name || resume.fileName || "Unknown Candidate";

  const handleMatch = () => {
    if (!jobDescription.trim()) return;
    setIsMatching(true);
    matchMutation.mutate({ id, data: { jobDescription } });
  };

  const getSkillColor = (category: string) => {
    switch (category) {
      case "technical": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "soft": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "tool": return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
      case "language": return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";
      case "framework": return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 [&>div]:bg-emerald-500";
    if (score >= 60) return "text-amber-500 [&>div]:bg-amber-500";
    return "text-red-500 [&>div]:bg-red-500";
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" className="gap-1 -ml-3 text-muted-foreground" asChild>
          <Link href="/resumes"><ArrowLeft className="h-4 w-4" /> Back to Library</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{name}</h1>
          {parsedData.experience?.[0] && (
            <p className="text-xl text-muted-foreground font-medium">
              {parsedData.experience[0].title}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the parsed resume.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate({ id })} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Info Card */}
          <Card className="border-t-4 border-t-primary shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                {parsedData.contact?.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <span className="font-medium text-foreground">{parsedData.contact.location}</span>
                  </div>
                )}
                {parsedData.contact?.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary/70" />
                    <span className="font-medium text-foreground">{parsedData.contact.email}</span>
                  </div>
                )}
                {parsedData.contact?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary/70" />
                    <span className="font-medium text-foreground">{parsedData.contact.phone}</span>
                  </div>
                )}
                {parsedData.contact?.linkedin && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Linkedin className="h-4 w-4 text-primary/70" />
                    <a href={parsedData.contact.linkedin} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">LinkedIn</a>
                  </div>
                )}
                {parsedData.contact?.github && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Github className="h-4 w-4 text-primary/70" />
                    <a href={parsedData.contact.github} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">GitHub</a>
                  </div>
                )}
                {parsedData.totalYearsExperience !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4 text-primary/70" />
                    <span className="font-medium text-foreground">{parsedData.totalYearsExperience} Years Experience</span>
                  </div>
                )}
              </div>

              {parsedData.summary && (
                <>
                  <Separator className="my-5" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Summary</h3>
                    <p className="text-sm leading-relaxed text-foreground/90">{parsedData.summary}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="experience" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
              <TabsTrigger value="experience" className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-6 h-full font-semibold">Experience</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-6 h-full font-semibold">Skills</TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-6 h-full font-semibold">Education & Projects</TabsTrigger>
              <TabsTrigger value="raw" className="data-[state=active]:border-primary data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-6 h-full font-semibold ml-auto">Raw Text</TabsTrigger>
            </TabsList>
            
            <TabsContent value="experience" className="pt-6 space-y-8">
              {!parsedData.experience?.length ? (
                <p className="text-muted-foreground italic py-8 text-center">No experience data found.</p>
              ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {parsedData.experience.map((job, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_hsl(var(--background))] z-10 font-bold">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col gap-1">
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription className="text-primary font-medium text-sm">{job.company}</CardDescription>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{job.startDate || "Unknown"}</span>
                              <span>—</span>
                              <span>{job.current ? "Present" : (job.endDate || "Unknown")}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {job.description && (
                            <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{job.description}</p>
                          )}
                          {job.achievements && job.achievements.length > 0 && (
                            <ul className="space-y-2 text-sm text-foreground/80">
                              {job.achievements.map((ach, idx) => (
                                <li key={idx} className="flex gap-2 items-start">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                                  <span className="leading-relaxed">{ach}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="skills" className="pt-6">
              {!parsedData.skills?.length ? (
                <p className="text-muted-foreground italic py-8 text-center">No skills data found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(
                    parsedData.skills.reduce((acc, skill) => {
                      acc[skill.category] = acc[skill.category] || [];
                      acc[skill.category].push(skill);
                      return acc;
                    }, {} as Record<string, typeof parsedData.skills>)
                  ).map(([category, skills]) => (
                    <Card key={category} className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          {category} Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, i) => (
                            <Badge 
                              key={i} 
                              variant="secondary" 
                              className={`font-medium py-1 px-3 border-transparent ${getSkillColor(skill.category)}`}
                            >
                              {skill.name}
                              {skill.level && (
                                <span className="ml-1.5 opacity-60 text-[10px] uppercase font-bold tracking-wider">
                                  • {skill.level}
                                </span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="education" className="pt-6 space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                  <GraduationCap className="text-primary h-6 w-6" /> Education
                </h3>
                {!parsedData.education?.length ? (
                  <p className="text-muted-foreground text-sm">No education data found.</p>
                ) : (
                  <div className="grid gap-4">
                    {parsedData.education.map((edu, i) => (
                      <Card key={i} className="shadow-sm">
                        <CardContent className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-lg">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                            <p className="text-primary font-medium">{edu.institution}</p>
                          </div>
                          <div className="text-left sm:text-right text-sm">
                            <div className="text-muted-foreground flex items-center sm:justify-end gap-1.5 mb-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {edu.startDate || "Unknown"} — {edu.endDate || "Unknown"}
                            </div>
                            {edu.gpa && <div className="font-semibold bg-muted px-2 py-0.5 rounded inline-block text-xs">GPA: {edu.gpa}</div>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {parsedData.projects && parsedData.projects.length > 0 && (
                <div className="space-y-6 pt-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                    <Award className="text-primary h-6 w-6" /> Projects & Certifications
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {parsedData.projects.map((proj, i) => (
                      <Card key={i} className="shadow-sm">
                        <CardContent className="p-5">
                          <h4 className="font-bold text-base mb-2 flex justify-between items-start">
                            {proj.name}
                            {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Globe className="h-4 w-4" /></a>}
                          </h4>
                          <p className="text-sm text-foreground/80 mb-4">{proj.description}</p>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {proj.technologies.map((tech, idx) => (
                                <span key={idx} className="text-[10px] uppercase tracking-wider font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="raw" className="pt-6">
              <Card>
                <CardContent className="p-0">
                  <pre className="p-6 text-xs text-muted-foreground font-mono whitespace-pre-wrap bg-muted/30 overflow-auto max-h-[600px] rounded-lg">
                    {resume.rawText}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Job Match */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 shadow-md border-primary/20 overflow-hidden">
            <div className="h-2 bg-primary w-full absolute top-0 left-0" />
            <CardHeader className="pb-4 bg-muted/10">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> Job Match Analysis
              </CardTitle>
              <CardDescription>
                Paste a job description to see how well this candidate matches the requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-card">
              
              {matchMutation.data ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" className="stroke-muted fill-none" strokeWidth="12" />
                        <circle 
                          cx="64" cy="64" r="56" 
                          className={`fill-none ${getScoreColor(matchMutation.data.matchScore)} transition-all duration-1000 ease-out`} 
                          strokeWidth="12" 
                          strokeDasharray={2 * Math.PI * 56} 
                          strokeDashoffset={2 * Math.PI * 56 * (1 - matchMutation.data.matchScore / 100)} 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className={`text-4xl font-extrabold ${getScoreColor(matchMutation.data.matchScore).split(' ')[0]}`}>
                          {matchMutation.data.matchScore}%
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Match</span>
                      </div>
                    </div>
                  </div>

                  {matchMutation.data.recommendation && (
                    <div className="bg-muted p-4 rounded-lg text-sm font-medium italic border-l-4 border-l-primary">
                      "{matchMutation.data.recommendation}"
                    </div>
                  )}

                  <Tabs defaultValue="skills" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="skills" className="space-y-4 pt-4">
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {matchMutation.data.skillsMatch.map((skill, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm border border-transparent hover:border-border transition-colors">
                            <span className="font-medium">{skill.skill}</span>
                            {skill.matched ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="analysis" className="space-y-6 pt-4">
                      <div>
                        <h4 className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                          <CheckCircle2 className="h-4 w-4" /> Strengths
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {matchMutation.data.strengths.map((s, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                              <span className="text-foreground/80 leading-snug">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-bold text-amber-600 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                          <Target className="h-4 w-4" /> Gaps & Areas to Probe
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {matchMutation.data.gaps.map((g, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                              <span className="text-foreground/80 leading-snug">{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => queryClient.setQueryData(["matchResumeToJob"], null)} // Hack to reset UI
                  >
                    Analyze Another Role
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Paste job description, requirements, and responsibilities here..."
                    className="min-h-[250px] resize-y text-sm bg-muted/30 focus:bg-background transition-colors"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!jobDescription.trim() || isMatching}
                    onClick={handleMatch}
                  >
                    {isMatching ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Match...</>
                    ) : (
                      <><Target className="mr-2 h-4 w-4" /> Calculate Match Score</>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}