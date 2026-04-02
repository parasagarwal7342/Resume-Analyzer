import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useParseResume, useGetResumeStats, getListResumesQueryKey, getGetResumeStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { FileUp, FileText, Loader2, Sparkles, Database, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useGetResumeStats();
  
  const parseMutation = useParseResume({
    mutation: {
      onSuccess: (data) => {
        toast({
          title: "Resume parsed successfully",
          description: "Data extracted and structured.",
        });
        queryClient.invalidateQueries({ queryKey: getListResumesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetResumeStatsQueryKey() });
        setLocation(`/resumes/${data.id}`);
      },
      onError: (error) => {
        toast({
          title: "Parsing failed",
          description: error?.error || "Could not parse the resume.",
          variant: "destructive",
        });
      }
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setText(result);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type !== "text/plain") {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file.",
        variant: "destructive"
      });
      return;
    }
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setText(result);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter or upload resume text.",
        variant: "destructive"
      });
      return;
    }
    
    parseMutation.mutate({ data: { text, fileName: fileName || undefined } });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-5xl">
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Intelligence for Resumes</h1>
        <p className="text-xl text-muted-foreground">
          Extract structured data, match candidates to jobs, and analyze talent pools with AI-powered parsing.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Resumes</p>
              <h3 className="text-2xl font-bold">{stats?.totalResumes || 0}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Experience</p>
              <h3 className="text-2xl font-bold">{stats?.avgYearsExperience ? `${stats.avgYearsExperience.toFixed(1)} yrs` : '0 yrs'}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unique Skills</p>
              <h3 className="text-2xl font-bold">{stats?.topSkills?.length || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-muted/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> 
            Parse New Resume
          </CardTitle>
          <CardDescription>
            Paste the raw text content of a resume below, or upload a .txt file. 
            The system will automatically extract skills, experience, education, and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FileUp className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Upload .txt file</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Drag and drop a text file here, or click to browse.
                </p>
              </div>
              <input
                type="file"
                accept=".txt"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
              {fileName && (
                <div className="mt-2 flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-md">
                  <FileText className="h-4 w-4" />
                  {fileName}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">Or paste raw text</span>
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Paste resume content here..."
              className="min-h-[250px] font-mono text-sm resize-y focus-visible:ring-primary/50"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-8" 
              onClick={handleSubmit}
              disabled={!text.trim() || parseMutation.isPending}
            >
              {parseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Parsing & Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Parse Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}