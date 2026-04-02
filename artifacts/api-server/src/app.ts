import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Paras@897399";

const requireAdminPassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const providedPassword =
    req.header("x-admin-password") ||
    (typeof req.query.adminPassword === "string" ? req.query.adminPassword : undefined) ||
    (req.body && typeof req.body.adminPassword === "string" ? req.body.adminPassword : undefined);

  if (providedPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized: invalid admin password" });
    return;
  }

  next();
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Require admin password for resume actions under /api/resumes
app.use("/api/resumes", requireAdminPassword);

app.use("/api", router);

export default app;
