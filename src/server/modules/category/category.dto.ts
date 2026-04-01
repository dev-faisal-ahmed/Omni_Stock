import z from "zod";

export const addCategoryDto = z
  .object({
    name: z.string().nonempty("Category name is required").trim(),
    slug: z.string().optional(),
  })
  .transform((data) => {
    const slugSource = data.slug || data.name;
    return { ...data, slug: transformSlug(slugSource) };
  });

export const getCategoriesDto = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(10),
});

// Helper function
function transformSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_") // replace one or more whitespace with single _
    .replace(/_+/g, "_"); // collapse multiple _ to single _
}

export type AddCategoryDto = z.infer<typeof addCategoryDto>;
export type GetCategoriesDto = z.infer<typeof getCategoriesDto>;
