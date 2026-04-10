import { openai } from "@workspace/integrations-openai-ai-server";

export interface ATSAnalysisResult {
  score: number;
  keywordMatch: {
    matched: string[];
    missing: string[];
    densityScore: number;
  };
  semanticMatch: {
    fitScore: number;
    explanation: string;
  };
  experienceAlignment: {
    levelMatch: boolean;
    yearsScore: number;
  };
  improvementSuggestions: string[];
}

export async function calculateATSScore(
  resumeData: any,
  jobDescription: string
): Promise<ATSAnalysisResult> {
  const systemPrompt = `You are a high-level ATS (Applicant Tracking System) algorithm.
Analyze the provided resume JSON against the job description.
Be objective and critical.

Return exactly this JSON structure:
{
  "score": number (0-100),
  "keywordMatch": {
    "matched": string[],
    "missing": string[],
    "densityScore": number (0-100)
  },
  "semanticMatch": {
    "fitScore": number (0-100),
    "explanation": string
  },
  "experienceAlignment": {
    "levelMatch": boolean,
    "yearsScore": number (0-100)
  },
  "improvementSuggestions": string[]
}

Rules:
- Matched keywords should be relevant technical and soft skills.
- Missing keywords are critical skills in the JD not found in the resume.
- Semantic match evaluates if the candidate's background actually fits the role beyond just keywords.
- Score should be a weighted average: 30% keywords, 40% semantic fit, 30% experience.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Using a reliable model
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Resume Data: ${JSON.stringify(resumeData)}\n\nJob Description: ${jobDescription}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to get response from AI");
  }

  return JSON.parse(content) as ATSAnalysisResult;
}
