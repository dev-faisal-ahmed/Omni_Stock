import { Hono } from "hono";
import { jsonValidator, queryValidator } from "@/server/utils/validator";
import { createOrderDto, getOrdersDto, updateOrderStatusDto, getOrderSummaryDto } from "./order.dto";
import { OrderService } from "./order.service";
import { ResponseDto } from "@/server/utils/response.dto";
import { authGuard } from "@/server/utils/auth.guard";

export const orderRoute = new Hono()
  .post("/", authGuard(), jsonValidator(createOrderDto), async (c) => {
    const payload = c.req.valid("json");
    const newOrder = await OrderService.createOrder(payload);
    return c.json(ResponseDto.success({ message: "Order created successfully", data: newOrder }));
  })
  .get("/", authGuard(), queryValidator(getOrdersDto), async (c) => {
    const dto = c.req.valid("query");
    const { orders, meta } = await OrderService.getOrders(dto);
    return c.json(
      ResponseDto.success({ message: "Orders retrieved successfully", data: orders, meta }),
    );
  })
  .patch("/:id", authGuard(), jsonValidator(updateOrderStatusDto), async (c) => {
    const id = c.req.param("id");
    const dto = c.req.valid("json");
    const updated = await OrderService.updateOrderStatus(id, dto);
    return c.json(
      ResponseDto.success({ message: "Order status updated successfully", data: updated }),
    );
  })
  .get("/summary", authGuard(), queryValidator(getOrderSummaryDto), async (c) => {
    const dto = c.req.valid("query");
    const summary = await OrderService.getOrderSummary(dto);
    return c.json(
      ResponseDto.success({ message: "Order summary retrieved successfully", data: summary }),
    );
  });

export type TOrderRoute = typeof orderRoute;
