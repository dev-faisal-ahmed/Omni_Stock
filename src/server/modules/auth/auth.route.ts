import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { jsonValidator } from "@/server/utils/validator";
import { loginDto, registerDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { ResponseDto } from "@/server/utils/response.dto";
import { AuthUtils } from "./auth.utils";
import { AppError } from "@/server/utils/app.error";

export const authRoute = new Hono()
  .post("/register", jsonValidator(registerDto), async (c) => {
    const newUser = await AuthService.register(c.req.valid("json"));
    return c.json(ResponseDto.success({ message: "User registered successfully", data: newUser }));
  })
  .post("/login", jsonValidator(loginDto), async (c) => {
    const token = await AuthService.login(c.req.valid("json"));
    setCookie(c, "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return c.json(ResponseDto.success("Logged in successfully"));
  })
  .get("/me", async (c) => {
    const token = getCookie(c, "token");
    if (!token) throw new AppError("Not authenticated", "UNAUTHORIZED");
    const payload = await AuthUtils.verifyToken(token);
    const user = await AuthService.me(payload.userId as string);
    return c.json(ResponseDto.success({ message: "User fetched", data: user }));
  })
  .post("/logout", async (c) => {
    deleteCookie(c, "token", { path: "/" });
    return c.json(ResponseDto.success("Logged out successfully"));
  });

export type AuthRoute = typeof authRoute;
