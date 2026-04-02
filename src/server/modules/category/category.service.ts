import { prisma } from "@/server/db";
import { AppError } from "@/server/utils/app.error";
import { AddCategoryDto, GetCategoriesDto, UpdateCategoryDto } from "./category.dto";
import { Pagination } from "@/server/utils/pagination";
import { CategoryWhereInput } from "@/generated/prisma/models";

export class CategoryService {
  static async addCategory(dto: AddCategoryDto) {
    const isCategoryExist = await prisma.category.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });

    if (isCategoryExist)
      throw new AppError("Category with the same slug already exists", "CONFLICT");

    const newCategory = await prisma.category.create({ data: dto });
    return newCategory;
  }

  static async getAllCategories(dto: GetCategoriesDto) {
    const { search, page, limit } = dto;
    const pagination = new Pagination(page, limit);

    const categoryQuery: CategoryWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: categoryQuery,
        skip: pagination.skip,
        take: pagination.take,

        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { products: true },
          },
        },
      }),

      prisma.category.count({ where: categoryQuery }),
    ]);

    return {
      categories: categories.map((cat) => {
        const { _count, ...rest } = cat;

        return {
          ...rest,
          productsCount: _count.products,
        };
      }),
      meta: pagination.getMeta(total),
    };
  }

  static async updateCategory(id: string, dto: UpdateCategoryDto) {
    const [category, categoryWithSlug] = await Promise.all([
      prisma.category.findUnique({ where: { id, isDeleted: false }, select: { id: true } }),
      prisma.category.findUnique({ where: { slug: dto.slug }, select: { id: true } }),
    ]);

    if (!category) throw new AppError("Category not found", "NOT_FOUND");
    if (categoryWithSlug && categoryWithSlug.id !== id)
      throw new AppError("Slug is already in use", "CONFLICT");

    const updated = await prisma.category.update({ where: { id }, data: dto });
    return updated;
  }

  static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id, isDeleted: false },
      select: { id: true },
    });

    if (!category) throw new AppError("Category not found", "NOT_FOUND");
    await prisma.category.update({ where: { id }, data: { isDeleted: true } });
  }
}
