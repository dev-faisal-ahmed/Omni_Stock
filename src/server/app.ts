import { Hono } from "hono";
import { logger } from "hono/logger";
import { ResponseDto } from "./core/response.dto";

export const app = new Hono().basePath("/api/v1");

app.use("*", logger());

app.get("/", (ctx) => {
  return ctx.json(ResponseDto.success("OmniStock API is running"));
});
