import { z } from "zod";

export const orderItemDto = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be greater than zero"),
});

export const createOrderDto = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  orderInfo: z.array(orderItemDto).min(1, "Order must contain at least one item"),
});

export type CreateOrderDto = z.infer<typeof createOrderDto>;
