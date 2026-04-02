import { useGetResumeStats } from "@workspace/api-client-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Database, TrendingUp, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Stats() {
  const { data: stats, isLoading } = useGetResumeStats();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Format data for charts
  const topSkillsData = stats.topSkills.map(s => ({
    name: s.skill,
    count: s.count
  })).slice(0, 10);

  const seniorityData = Object.entries(stats.seniorityBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Talent Analytics</h1>
        <p className="text-muted-foreground mt-1">Aggregate insights across your entire parsed resume database.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-t-4 border-t-blue-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium tracking-tight text-muted-foreground uppercase">Total Resumes</p>
              <Database className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-3xl font-bold">{stats.totalResumes}</div>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-emerald-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium tracking-tight text-muted-foreground uppercase">Avg Experience</p>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold">{stats.avgYearsExperience.toFixed(1)} <span className="text-lg text-muted-foreground font-medium">yrs</span></div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-purple-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium tracking-tight text-muted-foreground uppercase">Unique Skills</p>
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-3xl font-bold">{stats.topSkills.length}</div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-orange-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium tracking-tight text-muted-foreground uppercase">Top Location</p>
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-xl font-bold truncate mt-1">
              {stats.topLocations[0]?.location || "Unknown"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Skills Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Technologies & Skills</CardTitle>
            <CardDescription>Most frequently occurring skills across all resumes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSkillsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500}} />
                  <RechartsTooltip 
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Seniority Distribution */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Seniority Distribution</CardTitle>
            <CardDescription>Breakdown of candidate experience levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={seniorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {seniorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                    itemStyle={{fontWeight: 600}}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Custom Legend */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 max-w-[120px]">
                {seniorityData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="text-sm font-medium">{entry.name}</div>
                    <div className="text-sm text-muted-foreground ml-auto">{entry.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Locations Table */}
      <Card className="shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Top locations where candidates are based</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topLocations.slice(0, 5).map((loc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">{loc.location}</span>
                </div>
                <div className="font-bold bg-background px-3 py-1 rounded-md border shadow-sm">
                  {loc.count} <span className="text-muted-foreground text-xs font-normal ml-1">resumes</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}