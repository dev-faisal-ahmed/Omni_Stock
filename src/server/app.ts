import { Hono } from "hono";
import { logger } from "hono/logger";
import { ResponseDto } from "./utils/response.dto";
import { authRoute } from "./modules/auth/auth.route";

export const app = new Hono()
  .basePath("/api/v1")
  .use("*", logger())
  .get("/", (ctx) => {
    return ctx.json(ResponseDto.success("OmniStock API is running"));
  })
  .route("/auth", authRoute);
