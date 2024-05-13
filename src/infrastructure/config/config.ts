import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "your_secret_key",
  expiresIn: "1h",
};
