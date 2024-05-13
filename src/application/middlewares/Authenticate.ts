import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../infrastructure/security/AuthService";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const authService = new AuthService();
    const decoded = authService.verifyToken(token);
    req.body.userId = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}
