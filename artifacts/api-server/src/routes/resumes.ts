import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { resumesTable } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  ParseResumeBody,
  ListResumesQueryParams,
  GetResumeParams,
  DeleteResumeParams,
  MatchResumeToJobParams,
  MatchResumeToJobBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const PARSE_SYSTEM_PROMPT = `You are an expert resume parser. Extract structured information from the provided resume text and return a JSON object matching this exact schema:

{
  "contact": {
    "name": string,
    "email": string | null,
    "phone": string | null,
    "location": string | null,
    "linkedin": string | null,
    "github": string | null,
    "website": string | null
  },
  "summary": string | null,
  "experience": [
    {
      "company": string,
      "title": string,
      "startDate": string | null,
      "endDate": string | null,
      "current": boolean,
      "description": string | null,
      "achievements": string[]
    }
  ],
  "education": [
    {
      "institution": string,
      "degree": string,
      "field": string | null,
      "startDate": string | null,
      "endDate": string | null,
      "gpa": string | null
    }
  ],
  "skills": [
    {
      "name": string,
      "category": "technical" | "soft" | "language" | "tool" | "framework" | "other",
      "level": "beginner" | "intermediate" | "advanced" | "expert" | null
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string | null,
      "technologies": string[],
      "url": string | null
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuer": string | null,
      "date": string | null,
      "url": string | null
    }
  ],
  "languages": string[],
  "totalYearsExperience": number,
  "seniorityLevel": "entry" | "junior" | "mid" | "senior" | "lead" | "executive"
}

Rules:
- Infer seniorityLevel from experience and titles
- Calculate totalYearsExperience from work history (approximate years)
- Categorize skills accurately: programming languages/databases = technical, libraries/frameworks = framework, IDEs/tools = tool, spoken languages = language
- Extract ALL skills mentioned in experience and projects, not just dedicated skills sections
- Return ONLY the JSON object, no markdown, no explanations`;

const MATCH_SYSTEM_PROMPT = `You are an expert resume-to-job matcher. Analyze the candidate's resume and the job description to provide a detailed match analysis. Return ONLY a JSON object:

{
  "matchScore": number (0-100),
  "skillsMatch": [
    { "skill": string, "matched": boolean }
  ],
  "missingSkills": string[],
  "strengths": string[],
  "gaps": string[],
  "recommendation": string
}

Rules:
- matchScore: holistic score considering skills, experience level, domain relevance
- skillsMatch: list skills mentioned in job description and whether candidate has them
- missingSkills: important job skills the candidate is missing
- strengths: specific ways the candidate exceeds or matches requirements
- gaps: areas where candidate falls short
- recommendation: 2-3 sentence summary for the recruiter
Return ONLY the JSON, no markdown.`;

router.get("/resumes", async (req, res) => {
  const parsed = ListResumesQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 20) : 20;
  const offset = parsed.success ? (parsed.data.offset ?? 0) : 0;

  const [resumes, total] = await Promise.all([
    db
      .select()
      .from(resumesTable)
      .orderBy(desc(resumesTable.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(resumesTable),
  ]);

  res.json({
    resumes: resumes.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    total: Number(total[0].count),
  });
});

router.post("/resumes/parse", async (req, res) => {
  const body = ParseResumeBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { text, fileName } = body.data;

  if (!text || text.trim().length < 50) {
    res.status(400).json({ error: "Resume text is too short or empty" });
    return;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: PARSE_SYSTEM_PROMPT },
      { role: "user", content: `Parse this resume:\n\n${text.slice(0, 15000)}` },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 8192,
  });

  const rawParsed = completion.choices[0]?.message?.content;
  if (!rawParsed) {
    res.status(500).json({ error: "Failed to parse resume" });
    return;
  }

  let parsedData: unknown;
  try {
    parsedData = JSON.parse(rawParsed);
  } catch {
    res.status(500).json({ error: "Failed to parse AI response" });
    return;
  }

  const [inserted] = await db
    .insert(resumesTable)
    .values({
      fileName: fileName ?? null,
      rawText: text,
      parsedData: parsedData as Record<string, unknown>,
    })
    .returning();

  res.json({
    ...inserted,
    createdAt: inserted.createdAt.toISOString(),
  });
});

router.get("/resumes/stats", async (req, res) => {
  const allResumes = await db.select().from(resumesTable);

  const skillCounts: Record<string, number> = {};
  const seniorityBreakdown: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  let totalYears = 0;
  let yearsCount = 0;

  for (const resume of allResumes) {
    const data = resume.parsedData as {
      skills?: { name: string }[];
      seniorityLevel?: string;
      contact?: { location?: string };
      totalYearsExperience?: number;
    };

    if (data?.skills) {
      for (const skill of data.skills) {
        if (skill.name) {
          skillCounts[skill.name] = (skillCounts[skill.name] ?? 0) + 1;
        }
      }
    }

    if (data?.seniorityLevel) {
      seniorityBreakdown[data.seniorityLevel] =
        (seniorityBreakdown[data.seniorityLevel] ?? 0) + 1;
    }

    if (data?.contact?.location) {
      locationCounts[data.contact.location] =
        (locationCounts[data.contact.location] ?? 0) + 1;
    }

    if (typeof data?.totalYearsExperience === "number") {
      totalYears += data.totalYearsExperience;
      yearsCount++;
    }
  }

  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([skill, count]) => ({ skill, count }));

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([location, count]) => ({ location, count }));

  res.json({
    totalResumes: allResumes.length,
    topSkills,
    seniorityBreakdown,
    avgYearsExperience: yearsCount > 0 ? totalYears / yearsCount : 0,
    topLocations,
  });
});

router.get("/resumes/:id", async (req, res) => {
  const params = GetResumeParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [resume] = await db
    .select()
    .from(resumesTable)
    .where(eq(resumesTable.id, params.data.id));

  if (!resume) {
    res.status(404).json({ error: "Resume not found" });
    return;
  }

  res.json({
    ...resume,
    createdAt: resume.createdAt.toISOString(),
  });
});

router.delete("/resumes/:id", async (req, res) => {
  const params = DeleteResumeParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [deleted] = await db
    .delete(resumesTable)
    .where(eq(resumesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Resume not found" });
    return;
  }

  res.json({ success: true });
});

router.post("/resumes/:id/match", async (req, res) => {
  const params = MatchResumeToJobParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const body = MatchResumeToJobBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "jobDescription is required" });
    return;
  }

  const [resume] = await db
    .select()
    .from(resumesTable)
    .where(eq(resumesTable.id, params.data.id));

  if (!resume) {
    res.status(404).json({ error: "Resume not found" });
    return;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: MATCH_SYSTEM_PROMPT },
      {
        role: "user",
        content: `RESUME:\n${JSON.stringify(resume.parsedData, null, 2).slice(0, 8000)}\n\nJOB DESCRIPTION:\n${body.data.jobDescription.slice(0, 4000)}`,
      },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 8192,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    res.status(500).json({ error: "Failed to analyze match" });
    return;
  }

  let matchResult: unknown;
  try {
    matchResult = JSON.parse(raw);
  } catch {
    res.status(500).json({ error: "Failed to parse AI match response" });
    return;
  }

  res.json(matchResult);
});

export default router;
