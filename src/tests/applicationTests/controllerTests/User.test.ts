import request from "supertest";
import express from "express";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { userRouter } from "../../../application/controllers/User.controller";
import errorHandler from "../../../application/middlewares/ErrorHandler";
import { UserService } from "../../../application/services/User.service";

const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use(errorHandler);

type User = {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  password: string | null;
  id: number | null;
  role?: string;
};

let newUserData: User;

function generateToken(userId: number) {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign({ id: userId, email: "teste112321323@gmail.com" }, secret, {
    expiresIn: "1h",
  });
}

describe("POST /users", () => {
  beforeEach(async () => {
    newUserData = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      password: faker.internet.password(),
      id: null,
    };
  });

  it("should create a new User and return 201", async () => {
    const response = await request(app).post("/users").send(newUserData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      name: newUserData.name,
      email: newUserData.email,
      phoneNumber: newUserData.phoneNumber,
      role: "user",
      id: response.body.id,
    });
  });

  it("should create a new User (admin) and return 201", async () => {
    newUserData.role = "admin";
    const response = await request(app).post("/users").send(newUserData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      name: newUserData.name,
      email: newUserData.email,
      phoneNumber: newUserData.phoneNumber,
      role: "admin",
      id: response.body.id,
    });
  });

  it("should return 400 when not sending name", async () => {
    const { name, ...newUserDataWithoutName } = newUserData;

    const response = await request(app)
      .post("/users")
      .send(newUserDataWithoutName);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed",
      errors: "Name must be a string, Name is required",
    });
  });

  it("hould return 400 when not sending email", async () => {
    const { email, ...newUserDataWithoutEmail } = newUserData;

    const response = await request(app)
      .post("/users")
      .send(newUserDataWithoutEmail);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation failed",
      errors: "Invalid email format, Email is required",
    });
  });

  it("should return 500 if there is an error", async () => {
    UserService.prototype.createUser = jest.fn().mockRejectedValue(new Error());

    const response = await request(app).post("/users").send(newUserData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal server error",
    });
  });
});

describe("GET /users", () => {
  let validToken: string;
  beforeAll(() => {
    validToken = generateToken(1);
  });
  it("should retrieve all users", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should return 404 if user is not found", async () => {
    UserService.prototype.getUsers = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.status).toBe(404);
  });
  it("should return 500 if there is an error", async () => {
    UserService.prototype.getUsers = jest.fn().mockRejectedValue(new Error());

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error retrieving user",
      error: {},
    });
  });
  it("should return 401 if there is no token", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(401);
  });
});

describe("GET /users/:id", () => {
  let validToken: string;
  beforeEach(async () => {
    newUserData = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      password: faker.internet.password(),
      id: null,
    };
    validToken = generateToken(1);
  });

  it("should retrieve a User by id", async () => {
    UserService.prototype.getUserById = jest
      .fn()
      .mockResolvedValue(newUserData);
    const newUser = await request(app).post("/users").send(newUserData);

    const response = await request(app)
      .get(`/users/${newUser.body.id}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
  });

  it("should return 404 if the Notification does not exist", async () => {
    const response = await request(app)
      .get("/users/9999")
      .set("Authorization", `Bearer ${validToken}`);
    expect(response.status).toBe(404);
  });

  it("should return 500 if there is an error", async () => {
    UserService.prototype.getUserById = jest
      .fn()
      .mockRejectedValue(new Error());

    const newUser = await request(app).post("/users").send(newUserData);

    const response = await request(app)
      .get(`/users/${newUser.body.id}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error retrieving user",
      error: {},
    });
  });
  it("should return 401 if there is no token", async () => {
    const response = await request(app).get("/users/1");
    expect(response.status).toBe(401);
  });
});
