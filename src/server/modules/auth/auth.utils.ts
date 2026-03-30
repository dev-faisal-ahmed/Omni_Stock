import argon2 from "argon2";

export class AuthUtils {
  static async hashPassword(password: string) {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  static async verifyPassword(hash: string, plainPassword: string) {
    return argon2.verify(hash, plainPassword);
  }
}
