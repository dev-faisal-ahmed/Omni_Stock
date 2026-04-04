import {
  CreateOrderDto,
  GetOrdersDto,
  UpdateOrderStatusDto,
  GetOrderSummaryDto,
} from "./order.dto";
import { prisma } from "@/server/db";
import { AppError } from "@/server/utils/app.error";
import { Pagination } from "@/server/utils/pagination";
import { OrderWhereInput } from "@/generated/prisma/models";
import { ActivityService } from "../activity/activity.service";

export class OrderService {
  static async createOrder(payload: CreateOrderDto) {
    const { customerName, orderInfo } = payload;

    return prisma.$transaction(async (tx) => {
      const quantityByProduct = new Map<string, number>();

      for (const item of orderInfo) {
        quantityByProduct.set(
          item.productId,
          (quantityByProduct.get(item.productId) ?? 0) + item.quantity,
        );
      }

      const normalizedOrderInfo = Array.from(quantityByProduct.entries()).map(
        ([productId, quantity]) => ({ productId, quantity }),
      );

      const productsIds = normalizedOrderInfo.map((order) => order.productId);

      const products = await tx.product.findMany({
        where: { id: { in: productsIds }, isDeleted: false },
        select: { id: true, name: true, price: true, stock: true },
      });

      let totalPrice = 0;
      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const orderItem of normalizedOrderInfo) {
        const currentProduct = productMap.get(orderItem.productId);

        if (!currentProduct)
          throw new AppError(`Product not found: ${orderItem.productId}`, "NOT_FOUND");

        if (currentProduct.stock < orderItem.quantity)
          throw new AppError(
            `Insufficient stock for product: ${currentProduct.name}. Available: ${currentProduct.stock}, Requested: ${orderItem.quantity}`,
            "BAD_REQUEST",
          );

        totalPrice += currentProduct.price * orderItem.quantity;
      }

      // 2. Create the main Order record
      const order = await tx.order.create({
        data: {
          customerName,
          totalPrice,
        },
      });

      const stockUpdates = await Promise.all(
        normalizedOrderInfo.map((item) =>
          tx.product.updateMany({
            where: {
              id: item.productId,
              isDeleted: false,
              stock: { gte: item.quantity },
            },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      // checking if any stock update failed (i.e., no rows were updated)
      const failedIndex = stockUpdates.findIndex((result) => result.count === 0);
      if (failedIndex !== -1) {
        const failedItem = normalizedOrderInfo[failedIndex];
        const failedProduct = productMap.get(failedItem.productId);
        throw new AppError(
          `Insufficient stock for product: ${failedProduct?.name ?? failedItem.productId}`,
          "BAD_REQUEST",
        );
      }

      // 3. Create entries in the OrderProductJunction table
      await tx.orderProductJunction.createMany({
        data: normalizedOrderInfo.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // Fire and forget activity log (outside transaction)
      void ActivityService.logActivity(
        "ORDER",
        `Order Created : ${order.id} | Customer : ${order.customerName} | Total Price : ${totalPrice}`,
      );

      return { ...order, orderInfo: normalizedOrderInfo };
    });
  }

  static async getOrders(dto: GetOrdersDto) {
    const { status, startDate, endDate, sortByCreatedAt, page, limit } = dto;

    const pagination = new Pagination(page, limit);

    const orderQuery: OrderWhereInput = {
      ...(status && { status: status }),
      ...((startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: orderQuery,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: sortByCreatedAt },
        select: {
          id: true,
          customerName: true,
          totalPrice: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.order.count({ where: orderQuery }),
    ]);

    return {
      orders: orders.map((order) => ({
        orderId: order.id,
        customerName: order.customerName,
        totalPrice: order.totalPrice,
        orderStatus: order.status,
        createdAt: order.createdAt,
      })),
      meta: pagination.getMeta(total),
    };
  }

  static async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!order) throw new AppError("Order not found", "NOT_FOUND");

    const updated = await prisma.order.update({
      where: { id },
      data: { status: dto.status },
      select: { id: true, status: true },
    });

    void ActivityService.logActivity(
      "ORDER",
      `Order Status Updated : ${updated.id} | New Status : ${updated.status}`,
    );

    return updated;
  }

  static async getOrderSummary(dto: GetOrderSummaryDto) {
    const { startDate, endDate } = dto;

    // Build WHERE clause dynamically based on provided dates
    let whereClause = "1 = 1";
    const queryParams: Array<Date | null> = [];

    if (startDate) {
      whereClause += ` AND "createdAt" >= $${queryParams.length + 1}`;
      queryParams.push(startDate);
    }

    if (endDate) {
      whereClause += ` AND "createdAt" <= $${queryParams.length + 1}`;
      queryParams.push(endDate);
    }

    const query = `
      SELECT
        COUNT(*) as "totalOrders",
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as "pendingOrders",
        COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END) as "completedOrders",
        COALESCE(SUM(CASE WHEN status != 'CANCELLED' THEN "totalPrice" ELSE 0 END), 0) as "revenue"
      FROM "orders"
      WHERE ${whereClause}
    `;

    const summary = await prisma.$queryRawUnsafe<
      Array<{
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
        revenue: number;
      }>
    >(query, ...queryParams);

    const result = summary[0];

    return {
      totalOrders: Number(result.totalOrders),
      pendingOrders: Number(result.pendingOrders),
      completedOrders: Number(result.completedOrders),
      revenue: Number(result.revenue),
    };
  }
}
