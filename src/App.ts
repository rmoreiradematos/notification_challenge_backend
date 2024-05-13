import express from "express";
import cors from "cors";
import { userRouter } from "./application/controllers/User.controller";
import { channelRouter } from "./application/controllers/Channels.controller";
import { WorkerService } from "./infrastructure/messaging/WorkerService";
import { notificationRouter } from "./application/controllers/Notification.controller";
import { subscriptionRouter } from "./application/controllers/UserSubscription.controller";
import appEventEmitter from "./infrastructure/events/AppEventEmitter";
import errorHandler from "./application/middlewares/ErrorHandler";
import { authenticate } from "./application/middlewares/Authenticate";
import { authRouter } from "./application/controllers/AuthController";

const app = express();
const queueName = "notifications";
const worker = new WorkerService(queueName);

app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/channels", authenticate, channelRouter);
app.use("/api/v1/notifications", authenticate, notificationRouter);
app.use("/api/v1/subscriptions", authenticate, subscriptionRouter);
app.use(errorHandler);

async function startServices() {
  try {
    console.log("Starting worker...");
    appEventEmitter.on("notificationSent", async (message) => {
      await worker.initialize();
      console.log("Worker connected and consuming messages...");
    });
  } catch (error) {
    console.error("Failed to start worker:", error);
  }

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });

  process.on("SIGINT", async () => {
    console.log("Received SIGINT, shutting down...");
    await worker.close();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Received SIGTERM, shutting down...");
    await worker.close();
    process.exit(0);
  });
}

startServices().catch(console.error);

export default app;
