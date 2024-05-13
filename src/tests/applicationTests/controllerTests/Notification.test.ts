import request from "supertest";
import express from "express";
import { notificationRouter } from "../../../application/controllers/Notification.controller";
import errorHandler from "../../../application/middlewares/ErrorHandler";
import { NotificationService } from "../../../application/services/Notification.service";

const app = express();
app.use(express.json());
app.use("/notifications", notificationRouter);
app.use(errorHandler);

describe("POST /notifications", () => {
  it("should create a new Notification and return 201", async () => {
    const newNotificationData = {
      name: "New Notification",
      description: "A new Notification description",
    };
    const response = await request(app)
      .post("/notifications")
      .send(newNotificationData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      description: "A new Notification description",
      name: "New Notification",
      id: response.body.id,
    });
  });

  it("should return 400 when not sending name", async () => {
    const newNotificationData = {
      description: "A new Notification description",
    };

    const response = await request(app)
      .post("/notifications")
      .send(newNotificationData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed",
      errors: "Name must be a string, Name is required",
    });
  });

  it("hould return 400 when not sending description", async () => {
    const newNotificationData = {
      name: "new Notification",
    };

    const response = await request(app)
      .post("/notifications")
      .send(newNotificationData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed",
      errors: "Description must be a string",
    });
  });
});

describe("GET /notifications", () => {
  it("should retrieve all notifications", async () => {
    const response = await request(app).get("/notifications");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  it("should return 404 if there are no notifications", async () => {
    NotificationService.prototype.getNotifications = jest
      .fn()
      .mockResolvedValue(null);

    const response = await request(app).get("/notifications");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "notification not found" });
  });

  it("should return 500 if there is an error", async () => {
    NotificationService.prototype.getNotifications = jest
      .fn()
      .mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app).get("/notifications");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error retrieving notification",
      error: {},
    });
  });
});

describe("GET /notifications/:id", () => {
  it("should retrieve a Notification by id", async () => {
    const newNotificationData = {
      name: "New Notification",
      description: "A new Notification description",
    };
    const newNotification = await request(app)
      .post("/notifications")
      .send(newNotificationData);

    const response = await request(app).get(
      `/notifications/${newNotification.body.id}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", newNotification.body.id);
  });

  it("should return 404 if the Notification does not exist", async () => {
    const response = await request(app).get("/notifications/9999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "notification not found" });
  });

  it("should return 500 if there is an error", async () => {
    NotificationService.prototype.getNotificationById = jest
      .fn()
      .mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app).get("/notifications/1");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error retrieving notification",
      error: {},
    });
  });
});

describe("PUT /notifications/:id", () => {
  it("should return 400 if the Notification does not exist", async () => {
    const updatedData = {
      name: "Updated Notification Name",
      description: "A new Notification description",
    };
    const response = await request(app)
      .put("/notifications/999123")
      .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "notification not found" });
  });

  it("should update the Notification and return 200", async () => {
    NotificationService.prototype.getNotificationById = jest
      .fn()
      .mockResolvedValue({
        id: 1,
        name: "Updated Notification Name",
        description: "A new Notification description",
      });
    const newNotificationData = {
      name: "Old Notification",
      description: "An old Notification description",
    };

    const newNotification = await request(app)
      .post("/notifications")
      .send(newNotificationData);

    const updatedData = {
      name: "Updated Notification Name",
      description: "A new Notification description",
    };
    const response = await request(app)
      .put(`/notifications/${newNotification.body.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: newNotification.body.id,
      name: "Updated Notification Name",
      description: "A new Notification description",
    });
  });

  it("should return 400 when not sending name", async () => {
    const newNotificationData = {
      name: "Old Notification",
      description: "An old Notification description",
    };

    const newNotification = await request(app)
      .post("/notifications")
      .send(newNotificationData);

    const updatedData = {
      description: "A new Notification description",
    };

    const response = await request(app)
      .put(`/notifications/${newNotification.body.id}`)
      .send(updatedData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed",
      errors: "Name must be a string",
    });
  });
});

describe("DELETE /notifications/:id", () => {
  it("should delete the Notification and return 204", async () => {
    const newNotificationData = {
      name: "New Notification",
      description: "A new Notification description",
    };
    const newNotification = await request(app)
      .post("/notifications")
      .send(newNotificationData);

    const response = await request(app).delete(
      `/notifications/${newNotification.body.id}`
    );
    expect(response.status).toBe(204);
  });

  it("should return 500 if the Notification does not exist", async () => {
    const response = await request(app).delete("/notifications/9999");
    expect(response.status).toBe(500);
  });
});
