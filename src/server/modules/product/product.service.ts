import { prisma } from "@/server/db";
import { AppError } from "@/server/utils/app.error";
import { AddProductDto } from "./product.dto";

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
}
