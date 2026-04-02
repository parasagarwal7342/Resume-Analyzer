import { useListResumes } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { 
  Search, 
  MapPin, 
  Mail, 
  Briefcase, 
  GraduationCap,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Resumes() {
  const { data, isLoading } = useListResumes();
  
  const getSeniorityColor = (level?: string) => {
    switch (level) {
      case "executive": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "lead": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "senior": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "mid": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "junior": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "entry": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Library</h1>
          <p className="text-muted-foreground mt-1">Browse, search, and filter parsed resumes.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search skills, names..."
              className="w-full pl-9"
            />
          </div>
          <Button variant="outline" asChild>
            <Link href="/">Upload</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-48">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : data?.resumes.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <Briefcase className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't parsed any resumes yet. Upload a text resume to get started.
            </p>
            <Button asChild>
              <Link href="/">Parse First Resume</Link>
            </Button>
          </div>
        ) : (
          data?.resumes.map((resume) => {
            const { parsedData } = resume;
            const name = parsedData.contact?.name || resume.fileName || "Unknown Candidate";
            const topSkills = parsedData.skills?.slice(0, 8) || [];
            const latestJob = parsedData.experience?.[0];
            const latestEdu = parsedData.education?.[0];

            return (
              <Link key={resume.id} href={`/resumes/${resume.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch">
                      
                      <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-border/50 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                              {name}
                            </h3>
                            {latestJob && (
                              <p className="text-muted-foreground font-medium mt-1">
                                {latestJob.title} {latestJob.company ? `at ${latestJob.company}` : ''}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {parsedData.seniorityLevel && (
                              <Badge className={`uppercase text-[10px] tracking-wider font-bold border-none shadow-none ${getSeniorityColor(parsedData.seniorityLevel)}`} variant="outline">
                                {parsedData.seniorityLevel}
                              </Badge>
                            )}
                            {parsedData.totalYearsExperience !== undefined && (
                              <div className="text-sm font-semibold whitespace-nowrap text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                {parsedData.totalYearsExperience} YOE
                              </div>
                            )}
                          </div>
                        </div>

                        {topSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {topSkills.map((skill, i) => (
                              <Badge key={i} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-xs font-normal">
                                {skill.name}
                              </Badge>
                            ))}
                            {parsedData.skills && parsedData.skills.length > 8 && (
                              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                                +{parsedData.skills.length - 8} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-6 bg-muted/20 md:w-[320px] shrink-0 flex flex-col justify-center space-y-3 relative overflow-hidden">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary">
                          <ChevronRight className="h-8 w-8" />
                        </div>
                        
                        {parsedData.contact?.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate">{parsedData.contact.location}</span>
                          </div>
                        )}
                        {parsedData.contact?.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="truncate">{parsedData.contact.email}</span>
                          </div>
                        )}
                        {latestEdu && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCap className="h-4 w-4 shrink-0" />
                            <span className="truncate">{latestEdu.degree} • {latestEdu.institution}</span>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground/60 pt-2 border-t mt-auto">
                          Parsed on {format(new Date(resume.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}