import request from "supertest";
import express from "express";
import { channelRouter } from "../../../application/controllers/Channels.controller";
import errorHandler from "../../../application/middlewares/ErrorHandler";
import { ChannelService } from "../../../application/services/Channel.service";

const app = express();
app.use(express.json());
app.use("/channels", channelRouter);
app.use(errorHandler);

describe("POST /channels", () => {
  it("should return 404 if no channels are found", async () => {
    ChannelService.prototype.getChannels = jest
      .fn()
      .mockResolvedValue(undefined);

    const response = await request(app).get("/channels");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "channel not found" });
  });
  it("should handle errors when retrieving channels", async () => {
    ChannelService.prototype.getChannels = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/channels");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error retrieving channel",
      error: {},
    });
  });
  it("should create a new channel and return 201", async () => {
    const newChannelData = {
      name: "New Channel",
      description: "A new channel description",
    };
    const response = await request(app).post("/channels").send(newChannelData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      description: "A new channel description",
      name: "New Channel",
      id: response.body.id,
    });
  });

  it("should return 400 when not sending name", async () => {
    const newChannelData = {
      description: "A new channel description",
    };

    const response = await request(app).post("/channels").send(newChannelData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed",
      errors: "Name must be a string, Name is required",
    });
  });

  it("hould return 400 when not sending description", async () => {
    const newChannelData = {
      name: "new channel",
    };

    const response = await request(app).post("/channels").send(newChannelData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed",
      errors: "Description must be a string",
    });
  });
});

describe("GET /channels", () => {
  beforeEach(async () => {
    ChannelService.prototype.getChannels = jest.fn().mockResolvedValue([
      {
        id: 1,
        name: "Channel 1",
        description: "Channel 1 description",
      },
      {
        id: 2,
        name: "Channel 2",
        description: "Channel 2 description",
      },
    ]);
  });

  it("should retrieve all channels", async () => {
    const response = await request(app).get("/channels");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("GET /channels/:id", () => {
  beforeEach(async () => {
    ChannelService.prototype.getChannelById = jest.fn().mockResolvedValue({
      id: 1,
      name: "Channel 1",
      description: "Channel 1 description",
    });
  });
  it("should return 500 and Error retrieving channel", async () => {
    ChannelService.prototype.getChannelById = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/channels/1");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error retrieving channel",
      error: {},
    });
  });

  it("should retrieve a channel by id", async () => {
    const newChannelData = {
      name: "New Channel",
      description: "A new channel description",
    };
    const newChannel = await request(app)
      .post("/channels")
      .send(newChannelData);

    const response = await request(app).get(`/channels/${1}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });

  it("should return 404 if the channel does not exist", async () => {
    ChannelService.prototype.getChannelById = jest.fn().mockResolvedValue(null);
    const response = await request(app).get("/channels/9999");
    expect(response.status).toBe(404);
  });
});

describe("PUT /channels/:id", () => {
  it("should return 400 if the channel does not exist", async () => {
    const updatedData = {
      name: "Updated Channel Name",
      description: "A new channel description",
    };
    const response = await request(app).put("/channels/999").send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "channel not found" });
  });

  it("should return 400 if the description is not a string", async () => {
    const newChannelData = {
      name: "New Channel",
      description: "A new channel description",
    };
    const newChannel = await request(app)
      .post("/channels")
      .send(newChannelData);

    const updatedData = {
      name: "Updated Channel Name",
      description: 123,
    };
    const response = await request(app)
      .put(`/channels/${newChannel.body.id}`)
      .send(updatedData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed",
      errors: "Description must be a string",
    });
  });

  it("should update the channel and return 200", async () => {
    ChannelService.prototype.getChannelById = jest.fn().mockResolvedValue({
      id: 1,
      name: "Channel 1",
      description: "Channel 1 description",
    });
    const newChannelData = {
      name: "Old channel",
      description: "An old channel description",
    };

    const newChannel = await request(app)
      .post("/channels")
      .send(newChannelData);

    const updatedData = {
      name: "Updated Channel Name",
      description: "A new channel description",
    };
    const response = await request(app)
      .put(`/channels/${newChannel.body.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: newChannel.body.id,
      name: "Updated Channel Name",
      description: "A new channel description",
    });
  });
});

describe("DELETE /channels/:id", () => {
  it("should delete the channel and return 204", async () => {
    const newChannelData = {
      name: "New Channel",
      description: "A new channel description",
    };
    const newChannel = await request(app)
      .post("/channels")
      .send(newChannelData);

    const response = await request(app).delete(
      `/channels/${newChannel.body.id}`
    );
    expect(response.status).toBe(204);
  });

  it("should return 500 if the channel does not exist", async () => {
    const response = await request(app).delete("/channels/9999");
    expect(response.status).toBe(500);
  });
});
