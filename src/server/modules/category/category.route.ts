import { Hono } from "hono";
import { jsonValidator, queryValidator } from "@/server/utils/validator";
import { addCategoryDto, getCategoriesDto, updateCategoryDto } from "./category.dto";
import { CategoryService } from "./category.service";
import { ResponseDto } from "@/server/utils/response.dto";

export const categoryRoute = new Hono()
  .post("/", jsonValidator(addCategoryDto), async (c) => {
    const dto = c.req.valid("json");
    const newCategory = await CategoryService.addCategory(dto);
    return c.json(
      ResponseDto.success({ message: "Category added successfully", data: newCategory }),
    );
  })
  .get("/", queryValidator(getCategoriesDto), async (c) => {
    const dto = c.req.valid("query");
    const { categories, meta } = await CategoryService.getAllCategories(dto);
    return c.json(
      ResponseDto.success({ message: "Category Retrieved successfully", data: categories, meta }),
    );
  })
  .patch("/:id", jsonValidator(updateCategoryDto), async (c) => {
    const id = c.req.param("id");
    const dto = c.req.valid("json");
    const updated = await CategoryService.updateCategory(id, dto);
    return c.json(
      ResponseDto.success({ message: "Category updated successfully", data: updated }),
    );
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await CategoryService.deleteCategory(id);
    return c.json(ResponseDto.success({ message: "Category deleted successfully", data: null }));
  });

export type TCategoryRoute = typeof categoryRoute;