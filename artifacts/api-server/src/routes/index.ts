import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resumesRouter from "./resumes";
import atsRouter from "./ats";
import generatorRouter from "./generator";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resumesRouter);
router.use("/ats", atsRouter);
router.use("/resumes", generatorRouter);

export default router;
