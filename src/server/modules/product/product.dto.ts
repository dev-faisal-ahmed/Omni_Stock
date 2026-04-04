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

export const updateProductDto = z
  .object({
    name: z.string().trim().nonempty("Product name is required").optional(),
    categoryId: z.string().nonempty("Category ID is required").optional(),
    description: z.string().trim().optional(),
    price: z.number().nonnegative("Price cannot be negative").optional(),
    minimumThreshold: z
      .number()
      .int()
      .nonnegative("Minimum threshold cannot be negative")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const increaseProductStockDto = z
  .object({
    amount: z.number().int().positive("Amount must be greater than zero"),
  })
  .strict();

export const getLowStockProductsDto = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(10),
});

export type AddProductDto = z.infer<typeof addProductDto>;
export type GetProductsDto = z.infer<typeof getProductsDto>;
export type GetLowStockProductsDto = z.infer<typeof getLowStockProductsDto>;
export type UpdateProductDto = z.infer<typeof updateProductDto>;
export type UpdateProductInputDto = z.input<typeof updateProductDto>;
export type IncreaseProductStockDto = z.infer<typeof increaseProductStockDto>;
