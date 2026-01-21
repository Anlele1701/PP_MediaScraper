import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import { logger } from "./config/logger";

const app = express();
const port = Number(process.env.PORT) || 3000;

// Import routes
import mediaRoutes from "./routes/media.route";

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/v1/media", mediaRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected successfully");

    app.listen(port, () => {
      logger.info(`Server started at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Failed to start application");
    logger.error(error.stack ?? "No stack trace");
    process.exit(1);
  }
}

bootstrap();
