import express, { Request, Response } from "express";
import { AuthService } from "../../infrastructure/security/AuthService";

export const authRouter = express.Router();

authRouter.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  const authService = new AuthService();
  const token = await authService.validateUser(email, password);

  if (token) {
    return res.json({ token });
  } else {
    return res.status(401).send("Invalid credentials.");
  }
});
