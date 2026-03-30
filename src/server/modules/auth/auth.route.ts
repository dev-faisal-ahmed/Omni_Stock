import { Hono } from "hono";
import { jsonValidator } from "@/server/utils/validator";
import { registerDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { ResponseDto } from "@/server/utils/response.dto";

export const authRoute = new Hono().post("/register", jsonValidator(registerDto), async (c) => {
  const newUser = await AuthService.register(c.req.valid("json"));
  return c.json(ResponseDto.success({ message: "User registered successfully", data: newUser }));
});

export type AuthRoute = typeof authRoute;
