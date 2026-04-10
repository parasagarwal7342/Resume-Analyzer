import { openai } from "@workspace/integrations-openai-ai-server";

export interface OptimizationResult {
  improvedBulletPoints: { original: string; improved: string }[];
  overallFeedback: string;
  formattingScore: number;
}

export async function optimizeResumeContent(
  resumeData: any
): Promise<OptimizationResult> {
  const systemPrompt = `You are a resume transformation expert.
Rewrite the experience bullet points to be more impactful using the STAR (Situation, Task, Action, Result) method.
Provide overall feedback on the resume's clarity and impact.

Return JSON:
{
  "improvedBulletPoints": [
    { "original": string, "improved": string }
  ],
  "overallFeedback": string,
  "formattingScore": number (0-100)
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Resume Content: ${JSON.stringify(resumeData)}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("Optimization failed");
  }

  return JSON.parse(content) as OptimizationResult;
}
