import { Router, type IRouter } from "express";
import { generateOptimizedResume } from "@workspace/resume-generator";
import { GenerateResumeBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/generate", async (req, res) => {
  const body = GenerateResumeBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { userData, jobDescription, template } = body.data;

  try {
    const result = await generateOptimizedResume(userData, jobDescription, template);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate resume" });
  }
});

export default router;
