import { prisma } from "@/server/db";
import { AddCategoryDto, GetCategoriesDto } from "./category.dto";
import { AppError } from "@/server/utils/app.error";
import { Pagination } from "@/server/utils/pagination";
import { CategoryWhereInput } from "@/generated/prisma/models";

export class CategoryService {
  static async addCategory(dto: AddCategoryDto) {
    const isCategoryExist = await prisma.category.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });

    if (isCategoryExist) {
      throw new AppError("Category with the same slug already exists", "CONFLICT");
    }

    const newCategory = await prisma.category.create({ data: dto });
    return newCategory;
  }

  static async getAllCategories(dto: GetCategoriesDto) {
    const { search, page, limit } = dto;
    const pagination = new Pagination(page, limit);

    console.log({ search, page, limit });

    const categoryQuery: CategoryWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [categories, total] = await prisma.$transaction([
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
}
