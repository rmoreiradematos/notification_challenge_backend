import express from "express";
import { NotificationService } from "../services/Notification.service";
import { NotificationDto } from "../dtos/NotificationDto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CustomValidationError } from "../errors/CustomValidationError";
import { NotificationUpdateDto } from "../dtos/NotificationUpdateDto";

export const notificationRouter = express.Router();
const notificationService = new NotificationService();

notificationRouter.post("/", async (req, res, next) => {
  try {
    const notificationDto = plainToInstance(NotificationDto, req.body);
    const errors = await validate(notificationDto);
    if (errors.length > 0) {
      next(new CustomValidationError(errors));
    }

    const notification = await notificationService.createNotification(
      notificationDto
    );
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
});

notificationRouter.get("/", async (req, res) => {
  try {
    const notification = await notificationService.getNotifications();
    if (notification) {
      res.json(notification);
    } else {
      res.status(404).json({ message: "notification not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving notification", error: error });
  }
});

notificationRouter.get("/:id", async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(
      parseInt(req.params.id)
    );
    if (notification) {
      res.json(notification);
    } else {
      res.status(404).json({ message: "notification not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving notification", error: error });
  }
});

notificationRouter.put("/:id", async (req, res, next) => {
  try {
    const notificationDto = plainToInstance(NotificationUpdateDto, req.body);
    const errors = await validate(notificationDto);
    if (errors.length > 0) {
      next(new CustomValidationError(errors));
    }

    const validateIfExists = await notificationService.getNotificationById(
      parseInt(req.params.id)
    );
    if (!validateIfExists) {
      res.status(404).json({ message: "notification not found" });
    }
    const notification = await notificationService.updateNotification(
      parseInt(req.params.id),
      notificationDto
    );
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

notificationRouter.delete("/:id", async (req, res) => {
  try {
    await notificationService.deleteNotification(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: error });
  }
});
