import { prisma } from "@/server/db";
import { AppError } from "@/server/utils/app.error";
import { CreateOrderDto } from "./order.dto";

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

      return { ...order, orderInfo: normalizedOrderInfo };
    });
  }
}
