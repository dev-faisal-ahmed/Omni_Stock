import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { jsonValidator } from "@/server/utils/validator";
import { loginDto, registerDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { ResponseDto } from "@/server/utils/response.dto";
import { authGuard } from "@/server/utils/auth.guard";

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
  .get("/me", authGuard(), async (c) => {
    const user = c.get("user");
    return c.json(ResponseDto.success({ message: "User fetched", data: user }));
  })
  .post("/logout", async (c) => {
    deleteCookie(c, "token", { path: "/" });
    return c.redirect("/login");
  });

export type TAuthRoute = typeof authRoute;
