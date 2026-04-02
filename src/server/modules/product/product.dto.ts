import z from "zod";

export const addProductDto = z.object({
  name: z.string().trim().nonempty("Product name is required"),
  categoryId: z.string().nonempty("Category ID is required"),
  description: z.string().trim().optional(),
  price: z.number().nonnegative("Price cannot be negative"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  minimumThreshold: z.number().int().nonnegative("Minimum threshold cannot be negative"),
});

export type AddProductDto = z.infer<typeof addProductDto>;
