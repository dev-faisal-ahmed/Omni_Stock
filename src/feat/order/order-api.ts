import { orderClient } from "@/lib/client";
import { CreateOrderDto } from "@/server/modules/order/order.dto";

export async function createOrderApi(dto: CreateOrderDto) {
  const res = await orderClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}
