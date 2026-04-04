import { orderClient } from "@/lib/client";
import { CreateOrderDto } from "@/server/modules/order/order.dto";
import { OrderStatus } from "@/generated/prisma/enums";

export async function createOrderApi(dto: CreateOrderDto) {
  const res = await orderClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}

type TGetOrdersApiQuery = {
  page: string;
  limit: string;
  sortByCreatedAt: "asc" | "desc";
  status?: OrderStatus;
};

export async function getOrdersApi(query: TGetOrdersApiQuery) {
  const res = await orderClient.index.$get({ query });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}

export async function updateOrderStatusApi(id: string, status: OrderStatus) {
  const res = await orderClient[":id"].$patch({ param: { id }, json: { status } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}
