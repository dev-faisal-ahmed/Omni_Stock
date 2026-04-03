import z from "zod";

export const productFormSchema = z.object({
  name: z.string().trim().nonempty("Product name is required"),
  categoryId: z.string().nonempty("Category is required"),
  description: z.string().trim().optional(),
  price: z.coerce.number("Price is required").nonnegative("Price cannot be negative"),
  stock: z.coerce.number("Stock is required").int().nonnegative("Stock cannot be negative"),
  minimumThreshold: z.coerce
    .number("Minimum threshold is required")
    .int()
    .nonnegative("Minimum threshold cannot be negative"),
});

export const restockProductSchema = z.object({
  amount: z.coerce
    .number({ message: "Amount is required" })
    .int()
    .positive("Must restock a positive amount"),
});

export type TProductForm = z.infer<typeof productFormSchema>;
export type TRestockProductFormInput = z.input<typeof restockProductSchema>;
export type TProductFormInput = z.input<typeof productFormSchema>;
export type TRestockProductForm = z.infer<typeof restockProductSchema>;
