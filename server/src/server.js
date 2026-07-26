import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      logger.info("server_started", { port: Number(PORT) });
    });
  } catch (error) {
    logger.error("server_start_failed", { error });
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logger.error("unhandled_promise_rejection", {
    error: reason instanceof Error ? reason : new Error(String(reason)),
  });
});

process.on("uncaughtException", (error) => {
  logger.error("uncaught_exception", { error });
  process.exit(1);
});

startServer();
