import { openai } from "@workspace/integrations-openai-ai-server";

export interface GeneratedResume {
  content: any; // Structured resume JSON
  optimizedDescription: string;
  coverLetter?: string;
}

export async function generateOptimizedResume(
  userData: any,
  jobDescription?: string,
  targetTemplate: string = "modern"
): Promise<GeneratedResume> {
  const systemPrompt = `You are a professional resume writer and career coach.
Your task is to generate a highly optimized, ATS-friendly resume based on the user's data.
If a job description is provided, tailor the resume specifically for that role by highlighting relevant skills and experiences.

Return a JSON object with:
- "content": Full structured resume data (contact, summary, experience, education, skills, projects)
- "optimizedDescription": A 1-paragraph summary of why this resume is optimized for the role.
- "coverLetter": A professional cover letter based on the resume and JD.

Maintain a professional, high-impact tone. Use action verbs and quantifiable achievements.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `User Data: ${JSON.stringify(userData)}\n\nJob Description: ${jobDescription ?? "N/A"}\n\nTemplate: ${targetTemplate}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to generate resume");
  }

  return JSON.parse(content) as GeneratedResume;
}
