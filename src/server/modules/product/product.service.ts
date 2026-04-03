import { prisma } from "@/server/db";
import { AppError } from "@/server/utils/app.error";
import {
  AddProductDto,
  GetProductsDto,
  IncreaseProductStockDto,
  UpdateProductDto,
} from "./product.dto";
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

  static async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await prisma.product.findUnique({
      where: { id, isDeleted: false },
      select: { id: true },
    });

    if (!product) throw new AppError("Product not found", "NOT_FOUND");

    const [category, productWithName] = await Promise.all([
      dto.categoryId
        ? prisma.category.findUnique({
            where: { id: dto.categoryId, isDeleted: false },
            select: { id: true },
          })
        : null,

      dto.name
        ? prisma.product.findFirst({
            where: {
              name: { equals: dto.name, mode: "insensitive" },
              isDeleted: false,
              NOT: { id },
            },
          })
        : null,
    ]);

    if (dto.categoryId && !category) throw new AppError("Category not found", "NOT_FOUND");
    if (dto.name && productWithName)
      throw new AppError("Product with the same name already exists", "CONFLICT");

    const updated = await prisma.product.update({ where: { id }, data: dto });
    return updated;
  }

  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id, isDeleted: false },
      select: { id: true },
    });

    if (!product) throw new AppError("Product not found", "NOT_FOUND");
    await prisma.product.update({ where: { id }, data: { isDeleted: true } });
  }

  static async increaseProductStock(id: string, dto: IncreaseProductStockDto) {
    const product = await prisma.product.findUnique({
      where: { id, isDeleted: false },
      select: { id: true },
    });

    if (!product) throw new AppError("Product not found", "NOT_FOUND");

    const updated = await prisma.product.update({
      where: { id },
      data: { stock: { increment: dto.amount } },
    });

    return updated;
  }
}
