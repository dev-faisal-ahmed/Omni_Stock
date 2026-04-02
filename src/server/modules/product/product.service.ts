import { prisma } from "@/server/db";
import { AppError } from "@/server/utils/app.error";
import { AddProductDto, GetProductsDto } from "./product.dto";
import { Pagination } from "@/server/utils/pagination";
import { ProductWhereInput } from "@/generated/prisma/models";

export class ProductService {
  static async addProduct(dto: AddProductDto) {
    const [isProductExist, isCategoryExist] = await Promise.all([
      prisma.product.findFirst({
        where: { name: { equals: dto.name, mode: "insensitive" }, isDeleted: false },
        select: { id: true },
      }),
      prisma.category.findUnique({
        where: { id: dto.categoryId, isDeleted: false },
        select: { id: true },
      }),
    ]);

    if (isProductExist) throw new AppError("Product with the same name already exists", "CONFLICT");
    if (!isCategoryExist) throw new AppError("Category not found", "NOT_FOUND");

    const newProduct = await prisma.product.create({ data: dto });
    return newProduct;
  }

  static async getAllProducts(dto: GetProductsDto) {
    const { search, categoryId, page, limit } = dto;
    const pagination = new Pagination(page, limit);

    const productQuery: ProductWhereInput = {
      isDeleted: false,
      ...(categoryId && { categoryId }),
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: productQuery,
        skip: pagination.skip,
        take: pagination.take,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          minimumThreshold: true,
          status: true,
          categoryId: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.product.count({ where: productQuery }),
    ]);

    return {
      products,
      meta: pagination.getMeta(total),
    };
  }
}
