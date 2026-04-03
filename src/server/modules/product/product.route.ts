import { Hono } from "hono";
import { jsonValidator, queryValidator } from "@/server/utils/validator";
import {
  addProductDto,
  getProductsDto,
  increaseProductStockDto,
  updateProductDto,
} from "./product.dto";
import { ProductService } from "./product.service";
import { ResponseDto } from "@/server/utils/response.dto";

export const productRoute = new Hono()
  .post("/", jsonValidator(addProductDto), async (c) => {
    const dto = c.req.valid("json");
    const newProduct = await ProductService.addProduct(dto);
    return c.json(ResponseDto.success({ message: "Product added successfully", data: newProduct }));
  })
  .get("/", queryValidator(getProductsDto), async (c) => {
    const dto = c.req.valid("query");
    const { products, meta } = await ProductService.getAllProducts(dto);
    return c.json(
      ResponseDto.success({ message: "Products retrieved successfully", data: products, meta }),
    );
  })
  .patch("/:id", jsonValidator(updateProductDto), async (c) => {
    const id = c.req.param("id");
    const dto = c.req.valid("json");
    const updated = await ProductService.updateProduct(id, dto);
    return c.json(ResponseDto.success({ message: "Product updated successfully", data: updated }));
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await ProductService.deleteProduct(id);
    return c.json(ResponseDto.success({ message: "Product deleted successfully", data: null }));
  })
  .patch("/:id/stock", jsonValidator(increaseProductStockDto), async (c) => {
    const id = c.req.param("id");
    const dto = c.req.valid("json");
    const updated = await ProductService.increaseProductStock(id, dto);
    return c.json(
      ResponseDto.success({ message: "Product stock updated successfully", data: updated }),
    );
  });

export type TProductRoute = typeof productRoute;
