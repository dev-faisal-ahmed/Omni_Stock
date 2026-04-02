import z from "zod";

export const getProductsDto = z.object({
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(10),
});

export const addProductDto = z.object({
  name: z.string().trim().nonempty("Product name is required"),
  categoryId: z.string().nonempty("Category ID is required"),
  description: z.string().trim().optional(),
  price: z.number().nonnegative("Price cannot be negative"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  minimumThreshold: z.number().int().nonnegative("Minimum threshold cannot be negative"),
});

export type AddProductDto = z.infer<typeof addProductDto>;
export type GetProductsDto = z.infer<typeof getProductsDto>;
