import {
  AddProductDto,
  GetProductsDto,
  GetLowStockProductsDto,
  IncreaseProductStockDto,
  UpdateProductDto,
} from "./product.dto";
import { prisma } from "@/server/db";
import { AppError } from "@/server/utils/app.error";
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

  static async getProducts(dto: GetProductsDto) {
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
            select: { id: true, name: true },
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

  static async getAllProducts() {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        minimumThreshold: true,
      },
    });

    return products;
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

  static async getLowStockProducts(dto: GetLowStockProductsDto) {
    const { search, page, limit } = dto;
    const pagination = new Pagination(page, limit);

    let where = `WHERE p."isDeleted" = false AND p.stock < p."minimumThreshold"`;
    const whereParams = [];

    if (search) {
      where += ` AND p."name" ILIKE $${whereParams.length + 1}`;
      whereParams.push(`%${search}%`);
    }

    type ProductRow = {
      id: string;
      name: string;
      description: string | null;
      price: number;
      stock: number;
      minimumThreshold: number;
      categoryId: string;
      category: { id: string; name: string } | null;
    };

    type CountRow = {
      count: number;
    };

    const [products, countResult] = await Promise.all([
      prisma.$queryRawUnsafe<ProductRow[]>(
        `
          SELECT 
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p."minimumThreshold",
            p."categoryId",
            json_build_object('id', c.id, 'name', c.name) as category
          FROM products p
          LEFT JOIN categories c ON p."categoryId" = c.id
          ${where}
          ORDER BY p.stock ASC
          LIMIT ${pagination.take}
          OFFSET ${pagination.skip}
        `,
        ...whereParams,
      ),
      prisma.$queryRawUnsafe<CountRow[]>(
        `
          SELECT COUNT(*)::int as count
          FROM products p
          ${where}
        `,
        ...whereParams,
      ),
    ]);

    const total = countResult[0]?.count || 0;

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      minimumThreshold: product.minimumThreshold,
      categoryId: product.categoryId,
      category: product.category?.id
        ? { id: product.category.id, name: product.category.name }
        : null,
    }));

    return {
      products: formattedProducts,
      meta: pagination.getMeta(total),
    };
  }

  static async getLowStockCount() {
    type CountRow = {
      count: number;
    };

    const result = await prisma.$queryRawUnsafe<CountRow[]>(`
      SELECT COUNT(*)::int as count
      FROM products p
      WHERE p."isDeleted" = false AND p.stock < p."minimumThreshold"
    `);

    return result[0]?.count || 0;
  }
}
