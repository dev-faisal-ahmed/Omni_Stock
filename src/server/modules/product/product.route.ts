import {
  addProductDto,
  getProductsDto,
  getLowStockProductsDto,
  increaseProductStockDto,
  updateProductDto,
} from "./product.dto";
import { Hono } from "hono";
import { jsonValidator, queryValidator } from "@/server/utils/validator";
import { ProductService } from "./product.service";
import { ResponseDto } from "@/server/utils/response.dto";
import { authGuard } from "@/server/utils/auth.guard";

export const productRoute = new Hono()
  .post("/", authGuard(), jsonValidator(addProductDto), async (c) => {
    const dto = c.req.valid("json");
    const newProduct = await ProductService.addProduct(dto);
    return c.json(ResponseDto.success({ message: "Product added successfully", data: newProduct }));
  })
  .get("/", authGuard(), queryValidator(getProductsDto), async (c) => {
    const dto = c.req.valid("query");
    const { products, meta } = await ProductService.getProducts(dto);
    return c.json(
      ResponseDto.success({ message: "Products retrieved successfully", data: products, meta }),
    );
  })
  .get("/low-stock", authGuard(), queryValidator(getLowStockProductsDto), async (c) => {
    const dto = c.req.valid("query");
    const { products, meta } = await ProductService.getLowStockProducts(dto);
    return c.json(
      ResponseDto.success({
        message: "Low stock products retrieved successfully",
        data: products,
        meta,
      }),
    );
  })
  .get("/all", authGuard(), async (c) => {
    const products = await ProductService.getAllProducts();
    return c.json(
      ResponseDto.success({ message: "Products retrieved successfully", data: products }),
    );
  })
  .patch("/:id", authGuard(), jsonValidator(updateProductDto), async (c) => {
    const id = c.req.param("id");
    const dto = c.req.valid("json");
    const updated = await ProductService.updateProduct(id, dto);
    return c.json(ResponseDto.success({ message: "Product updated successfully", data: updated }));
  })
  .delete("/:id", authGuard("ADMIN"), async (c) => {
    const id = c.req.param("id");
    await ProductService.deleteProduct(id);
    return c.json(ResponseDto.success({ message: "Product deleted successfully", data: null }));
  })
  .patch("/:id/stock", authGuard(), jsonValidator(increaseProductStockDto), async (c) => {
    const id = c.req.param("id");
    const dto = c.req.valid("json");
    const updated = await ProductService.increaseProductStock(id, dto);
    return c.json(
      ResponseDto.success({ message: "Product stock updated successfully", data: updated }),
    );
  });

export type TProductRoute = typeof productRoute;
