import request from "supertest";
import express from "express";
import { subscriptionRouter } from "../../../application/controllers/UserSubscription.controller";
import errorHandler from "../../../application/middlewares/ErrorHandler";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { User } from "../../../core/entities/User";
import { Channel } from "../../../core/entities/Channel";
import { Notification } from "../../../core/entities/Notification";
import { userRouter } from "../../../application/controllers/User.controller";
import { notificationRouter } from "../../../application/controllers/Notification.controller";
import { channelRouter } from "../../../application/controllers/Channels.controller";
import { UserSubscriptionService } from "../../../application/services/UserSubscription.service";

const app = express();
app.use(express.json());
app.use("/subscriptions", subscriptionRouter);
app.use("/users", userRouter);
app.use("/notifications", notificationRouter);
app.use("/channels", channelRouter);
app.use(errorHandler);

let user: User, channel: Channel, notification: Notification;

function generateToken(userId: number) {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign({ id: userId, email: "rmoreiradematos1@gmail.com" }, secret, {
    expiresIn: "1h",
  });
}
describe("POST /subscriptions", () => {
  let validToken: string;
  beforeEach(async () => {
    user = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      password: faker.internet.password(),
      role: "user",
    };
    channel = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    };

    notification = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    };

    const newUser = await request(app).post("/users").send(user);
    user.id = newUser.body.id;
    const newChannel = await request(app).post("/channels").send(channel);
    channel.id = newChannel.body.id;
    const newNotification = await request(app)
      .post("/notifications")
      .send(notification);
    notification.id = newNotification.body.id;
  });

  beforeAll(() => {
    validToken = generateToken(1);
  });
  it("should create a new subscription and return 201", async () => {
    const newSubscriptionData = {
      userId: 1,
      channelId: 1,
      notificationId: 1,
    };

    const response = await request(app)
      .post("/subscriptions")
      .send(newSubscriptionData)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      userId: 1,
      channelId: 1,
      notificationId: 1,
      id: response.body.id,
      createdAt: response.body.createdAt,
      updatedAt: response.body.updatedAt,
    });
  });

  it("should return 400 if the subscription data is invalid", async () => {
    const newSubscriptionData = {
      userId: user.id,
      channelId: channel.id,
    };

    const response = await request(app)
      .post("/subscriptions")
      .send(newSubscriptionData)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(400);
  });

  it("should return 400 if the user does not exist", async () => {
    const newSubscriptionData = {
      userId: "123",
      channelId: channel.id,
      notificationId: notification.id,
    };

    const response = await request(app)
      .post("/subscriptions")
      .send(newSubscriptionData)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(400);
  });

  it("should return 400 if the channel does not exist", async () => {
    const newSubscriptionData = {
      userId: user.id,
      channelId: "123",
      notificationId: notification.id,
    };

    const response = await request(app)
      .post("/subscriptions")
      .send(newSubscriptionData)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(400);
  });

  it("should return 500 if the notification does not exist", async () => {
    UserSubscriptionService.prototype.addSubscription = jest
      .fn()
      .mockRejectedValue(new Error("Error adding subscription"));

    const response = await request(app)
      .post("/subscriptions")
      .send({})
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(500);
  });
});

describe("POST /subscriptions/notify", () => {
  let validToken: string;
  beforeAll(() => {
    validToken = generateToken(1);
  });
  beforeEach(async () => {
    user = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      password: faker.internet.password(),
      role: "user",
    };
    channel = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    };

    notification = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    };

    const newUser = await request(app).post("/users").send(user);
    user.id = newUser.body.id;
    const newChannel = await request(app)
      .post("/channels")
      .send(channel)
      .set("Authorization", `Bearer ${validToken}`);
    channel.id = newChannel.body.id;
    const newNotification = await request(app)
      .post("/notifications")
      .send(notification);
    notification.id = newNotification.body.id;
  });

  it("should sent message to queue and return that message was sent and status 200", async () => {
    const nofitication = {
      userId: 1,
      channelId: channel.id,
      message: "notification for all people on the channel",
    };
    const response = await request(app)
      .post("/subscriptions/notify")
      .send(nofitication)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Notification sent",
    });
  });
  it("should return 500 if there is any error", async () => {
    UserSubscriptionService.prototype.notifySubscribers = jest
      .fn()
      .mockRejectedValue(new Error("Unknown error"));

    const nofitication = {
      userId: 1,
      channelId: channel.id,
      message: "notification for all people on the channel",
    };

    const response = await request(app)
      .post("/subscriptions/notify")
      .send(nofitication)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal server error",
    });
  });
});

describe("DELETE /subscriptions/:userId/:channelId", () => {
  it("should delete a subscription and return 204", async () => {
    const newSubscriptionData = {
      userId: user.id,
      channelId: channel.id,
      notificationId: notification.id,
    };
    const newSubscription = await request(app)
      .post("/subscriptions")
      .send(newSubscriptionData);

    const response = await request(app).delete(
      `/subscriptions/${user.id}/${channel.id}`
    );

    expect(response.status).toBe(204);
  });
  it("should return 500 if there is an error", async () => {
    UserSubscriptionService.prototype.unsubscribe = jest
      .fn()
      .mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app).delete(`/subscriptions/1/1`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal server error",
    });
  });
});
