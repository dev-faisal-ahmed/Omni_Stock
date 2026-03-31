import argon2 from "argon2";
import { sign, verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthUtils {
  static async hashPassword(password: string) {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  static async comparePassword(hash: string, plainPassword: string) {
    return argon2.verify(hash, plainPassword);
  }

  static async generateToken(userId: string) {
    return sign({ userId }, JWT_SECRET);
  }

  static async verifyToken(token: string) {
    return verify(token, JWT_SECRET, { alg: "HS256" });
  }
}
