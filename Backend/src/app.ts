import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import fallaciesRoutes from "./routes/fallacies.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import questionsRoutes from "./routes/questions.routes.js";
import explainerRoutes from "./routes/explainer.routes.js";
import debaterRoutes from "./routes/debater.routes.js";
import evaluatorRoutes from "./routes/evaluator.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import geminiRoutes from "./routes/gemini.routes.js";
import tipsRoutes from "./routes/tips.routes.js";
import detectorRoutes from "./routes/detector.routes.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
  app.use(express.json());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRoutes);
  app.use("/api/fallacies", fallaciesRoutes);
  app.use("/api/quiz", quizRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/questions", questionsRoutes);
  app.use("/api/explainer", explainerRoutes);
  app.use("/api/debater", debaterRoutes);
  app.use("/api/evaluator", evaluatorRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/gemini", geminiRoutes);
  app.use("/api/tips", tipsRoutes);
  app.use("/api/detector", detectorRoutes);

  app.use(errorHandler);
  return app;
}
