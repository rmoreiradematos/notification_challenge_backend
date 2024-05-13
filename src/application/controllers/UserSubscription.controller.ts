import express from "express";
import { UserSubscriptionService } from "../services/UserSubscription.service";
import { UserSubscriptionDto } from "../dtos/UserSubscriptionDto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";
import { UserService } from "../services/User.service";

export const subscriptionRouter = express.Router();
const userSubscription = new UserSubscriptionService();

subscriptionRouter.post("/", async (req, res, next) => {
  try {
    req.body.userId = req.body.userId.userId || req.body.userId;
    const userDto = plainToInstance(UserSubscriptionDto, req.body);
    const errors = await validate(userDto);
    if (errors.length > 0) {
      return next(new CustomValidationError(errors));
    }

    const UserSubscription = await userSubscription.addSubscription(userDto);
    res.status(201).json(UserSubscription);
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.post("/notify", async (req, res, next) => {
  try {
    const { channelId, message } = req.body;
    req.body.userId = req.body.userId.userId;
    const userId = parseInt(req.body.userId);
    await userSubscription.notifySubscribers(userId, channelId, message);
    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.delete("/:userId/:channelId", async (req, res, next) => {
  try {
    const { userId, channelId } = req.params;
    await userSubscription.unsubscribe(Number(userId), Number(channelId));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

subscriptionRouter.get("/logs", async (req, res, next) => {
  try {
    const logs = await userSubscription.getLogs();
    const userService = new UserService();
    const formattedLogs = await Promise.all(
      logs.map(async (log) => {
        const userSent = log.userSentMessage
          ? await userService.getUserById(log.userSentMessage)
          : null;
        if (userSent) {
          log.userSentMessage = userSent.name;
        }
        const userReceived = log.userReceivedMessage
          ? await userService.getUserById(log.userReceivedMessage)
          : null;
        if (userReceived) {
          log.userReceivedMessage = userReceived.name;
        }
        return {
          ...log,
        };
      })
    );
    res.status(200).json(formattedLogs);
  } catch (error) {
    next(error);
  }
});
