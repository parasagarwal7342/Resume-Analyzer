import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { resumesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { calculateATSScore } from "@workspace/ats";
import { AtsScoreBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/score", async (req, res) => {
  const body = AtsScoreBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { resumeId, jobDescription } = body.data;

  const [resume] = await db
    .select()
    .from(resumesTable)
    .where(eq(resumesTable.id, resumeId));

  if (!resume) {
    res.status(404).json({ error: "Resume not found" });
    return;
  }

  try {
    const result = await calculateATSScore(resume.parsedData, jobDescription);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to calculate ATS score" });
  }
});

export default router;
