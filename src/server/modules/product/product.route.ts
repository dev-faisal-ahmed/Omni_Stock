import { Hono } from "hono";
import { jsonValidator, queryValidator } from "@/server/utils/validator";
import { addProductDto, getProductsDto } from "./product.dto";
import { ProductService } from "./product.service";
import { ResponseDto } from "@/server/utils/response.dto";

export const productRoute = new Hono()
  .post("/", jsonValidator(addProductDto), async (c) => {
    const dto = c.req.valid("json");
    const newProduct = await ProductService.addProduct(dto);
    return c.json(
      ResponseDto.success({ message: "Product added successfully", data: newProduct }),
    );
  })
  .get("/", queryValidator(getProductsDto), async (c) => {
    const dto = c.req.valid("query");
    const { products, meta } = await ProductService.getAllProducts(dto);
    return c.json(
      ResponseDto.success({ message: "Products retrieved successfully", data: products, meta }),
    );
  });

export type TProductRoute = typeof productRoute;
