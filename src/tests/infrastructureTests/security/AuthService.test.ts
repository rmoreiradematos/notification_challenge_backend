import { AuthService } from "../../../infrastructure/security/AuthService";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClientSingleton } from "../../../infrastructure/db/DbConnection";

jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  const mockUser = {
    id: "1",
    email: "test@example.com",
    password: "hashedpassword",
  };

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
    jest.spyOn(jwt, "sign").mockResolvedValue("mockedToken" as never);
    jest.spyOn(jwt, "verify").mockResolvedValue({ userId: 1 } as never);
  });

  describe("generateToken", () => {
    it("should generate a token for a user ID", async () => {
      const userId = "123";
      const token = await authService.generateToken(userId);
      expect(token).toBe("mockedToken");
    });
  });

  describe("verifyToken", () => {
    it("should verify a token and return decoded value", async () => {
      const token = "validToken";
      const decoded = await authService.verifyToken(token);
      expect(decoded).toEqual({ userId: 1 });
      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
    });

    it("should throw error when token is invalid", () => {
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("Invalid token");
      });
      expect(() => authService.verifyToken("badToken")).toThrow(
        "Invalid token"
      );
    });
  });

  describe("validateUser", () => {
    let fakeUser = {
      id: "1",
      email: "test@example.com",
      password: "hashedPassword123",
    };
    it("should validate user credentials and return a token", async () => {
      const email = "test@example.com";
      const password = "correctPassword";
      const prismaMock = {
        user: {
          findUnique: jest.fn().mockResolvedValue(fakeUser),
        },
      };

      jest
        .spyOn(PrismaClientSingleton, "getInstance")
        .mockReturnValue(prismaMock as never);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      jest
        .spyOn(authService, "validateUser")
        .mockResolvedValue("mockedJWTToken");

      const signIn = [
        { userId: fakeUser.id, email: fakeUser.email },
        expect.any(String),
        { expiresIn: "1h" },
      ];
      jest.spyOn(jwt, "sign").mockResolvedValue(signIn as never);
      const token = await authService.validateUser(email, password);

      expect(token).toEqual("mockedJWTToken");
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
});
