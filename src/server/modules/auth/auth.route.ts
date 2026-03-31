import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { jsonValidator } from "@/server/utils/validator";
import { loginDto, registerDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { ResponseDto } from "@/server/utils/response.dto";

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
  });

export type AuthRoute = typeof authRoute;
