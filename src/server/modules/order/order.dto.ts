import { OrderStatus } from "@/generated/prisma/enums";
import { z } from "zod";

export const orderItemDto = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be greater than zero"),
});

export const createOrderDto = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  orderInfo: z.array(orderItemDto).min(1, "Order must contain at least one item"),
});

export const getOrdersDto = z
  .object({
    status: z.enum(Object.values(OrderStatus)).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    sortByCreatedAt: z.enum(["asc", "desc"]).catch("desc"),
    page: z.coerce.number().int().positive().catch(1),
    limit: z.coerce.number().int().positive().max(100).catch(10),
  })
  .refine((data) => !(data.startDate && data.endDate) || data.startDate <= data.endDate, {
    message: "startDate must be less than or equal to endDate",
    path: ["startDate"],
  });

export const updateOrderStatusDto = z.object({
  status: z.enum(Object.values(Object.values(OrderStatus)), "Invalid order status"),
});

export type CreateOrderDto = z.infer<typeof createOrderDto>;
export type GetOrdersDto = z.infer<typeof getOrdersDto>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusDto>;
