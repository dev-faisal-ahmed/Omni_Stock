import { Hono } from "hono";
import { jsonValidator } from "@/server/utils/validator";
import { addProductDto } from "./product.dto";
import { ProductService } from "./product.service";
import { ResponseDto } from "@/server/utils/response.dto";

export const productRoute = new Hono().post("/", jsonValidator(addProductDto), async (c) => {
  const dto = c.req.valid("json");
  const newProduct = await ProductService.addProduct(dto);
  return c.json(
    ResponseDto.success({ message: "Product added successfully", data: newProduct }),
  );
});

export type TProductRoute = typeof productRoute;
