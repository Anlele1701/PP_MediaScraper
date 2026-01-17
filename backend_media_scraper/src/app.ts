import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { AppDataSource } from "./config/data-source";
import { logger } from "./config/logger";

const app = express();
const port = Number(process.env.PORT) || 3000;

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
