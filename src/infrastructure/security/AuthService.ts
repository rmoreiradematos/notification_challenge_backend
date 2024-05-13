import jwt, { sign, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IAuthService } from "../../core/interfaces/IAuthService";
import { jwtConfig } from "../config/config";
import { PrismaClientSingleton } from "../db/DbConnection";

export class AuthService implements IAuthService {
  generateToken(userId: string): string {
    return sign({ userId }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }

  verifyToken(token: string): string | object {
    try {
      return verify(token, jwtConfig.secret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async validateUser(email: string, password: string): Promise<string | null> {
    const prisma = PrismaClientSingleton.getInstance();
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );
      return token;
    }

    return null;
  }
}
