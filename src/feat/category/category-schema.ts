import z from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().nonempty("Category name is required"),
  slug: z.string().trim().optional(),
});

export type TCategoryForm = z.infer<typeof categoryFormSchema>;
