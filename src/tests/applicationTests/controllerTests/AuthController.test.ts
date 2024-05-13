import request from "supertest";
import express from "express";
import { authRouter } from "../../../application/controllers/AuthController";
import { AuthService } from "../../../infrastructure/security/AuthService";

jest.mock("../../../infrastructure/security/AuthService");

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("POST /auth", () => {
  it("should return 400 if email or password is missing", async () => {
    const response = await request(app)
      .post("/auth")
      .send({ email: "user@example.com" });

    expect(response.status).toBe(400);
    expect(response.text).toBe("Email and password are required.");
  });

  it("should return 401 if credentials are invalid", async () => {
    AuthService.prototype.validateUser = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post("/auth")
      .send({ email: "user@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid credentials.");
  });

  it("should return a JSON object with a token if credentials are valid", async () => {
    AuthService.prototype.validateUser = jest
      .fn()
      .mockResolvedValue("mockedToken");

    const response = await request(app)
      .post("/auth")
      .send({ email: "user@example.com", password: "correctpassword" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: "mockedToken" });
  });
});
