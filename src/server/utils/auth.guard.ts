import { prisma } from "../db";
import { createMiddleware } from "hono/factory";
import { UserRole } from "@/generated/prisma/enums";
import { UserModel } from "@/generated/prisma/models";
import { AuthUtils } from "../modules/auth/auth.utils";
import { getCookie } from "hono/cookie";
import { AppError } from "./app.error";

type TEnv = {
  Variables: {
    user: TAuthUser;
  };
};

export type TAuthUser = Pick<UserModel, "id" | "name" | "email" | "role">;

export function authGuard(...roles: UserRole[]) {
  return createMiddleware<TEnv>(async (c, next) => {
    const token = getCookie(c, "token");
    if (!token) throw new AppError("Not authenticated", "UNAUTHORIZED");

    const payload = await AuthUtils.verifyToken(token);
    if (!payload?.userId) throw new AppError("Invalid token payload", "UNAUTHORIZED");

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) throw new AppError("User not found", "UNAUTHORIZED");
    if (roles.length > 0 && !roles.includes(user.role)) {
      throw new AppError("Forbidden", "FORBIDDEN");
    }

    c.set("user", user);
    await next();
  });
}
