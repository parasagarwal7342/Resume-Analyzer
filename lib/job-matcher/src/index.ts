import { openai } from "@workspace/integrations-openai-ai-server";

export interface JobMatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  roleFit: string;
  careerAdvice: string;
}

export async function matchJob(
  resumeData: any,
  jobDescription: string
): Promise<JobMatchResult> {
  const systemPrompt = `You are a career consultant specializing in job matching.
Compare the user's resume data with the job description.
Calculate a match percentage and identify strengths and gaps.

Return JSON:
{
  "matchPercentage": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "roleFit": string, (Professional summary of fit)
  "careerAdvice": string (How to pivot or improve for this role)
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Resume: ${JSON.stringify(resumeData)}\n\nJob: ${jobDescription}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("Match failed");
  }

  return JSON.parse(content) as JobMatchResult;
}
