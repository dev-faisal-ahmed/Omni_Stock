import { ToString } from "@/lib/types";
import { AddProductDto, GetProductsDto } from "@/server/modules/product/product.dto";
import { productClient } from "@/lib/client";

export async function addProductApi(dto: AddProductDto) {
  const res = await productClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}

export async function getProductsApi(query: ToString<GetProductsDto>) {
  const res = await productClient.index.$get({ query });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}
