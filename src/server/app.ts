import { Hono } from "hono";
import { logger } from "hono/logger";
import { ResponseDto } from "./utils/response.dto";
import { authRoute } from "./modules/auth/auth.route";
import { errorHandler } from "./utils/error.handler";
import { categoryRoute } from "./modules/category/category.route";
import { productRoute } from "./modules/product/product.route";

export const app = new Hono()
  .basePath("/api/v1")
  .use("*", logger())
  .get("/", (c) => c.json(ResponseDto.success("OmniStock API is running")))
  .route("/auth", authRoute)
  .route("/categories", categoryRoute)
  .route("/products", productRoute)
  .onError(errorHandler);
