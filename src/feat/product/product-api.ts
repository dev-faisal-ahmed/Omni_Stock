import { ToString } from "@/lib/types";
import {
  AddProductDto,
  GetProductsDto,
  IncreaseProductStockDto,
  UpdateProductInputDto,
} from "@/server/modules/product/product.dto";
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

export async function updateProductApi({ id, ...dto }: UpdateProductInputDto & { id: string }) {
  const res = await productClient[":id"].$patch({ param: { id }, json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}

export async function deleteProductApi(id: string) {
  const res = await productClient[":id"].$delete({ param: { id } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}

export async function increaseProductStockApi({ id, amount }: IncreaseProductStockDto & { id: string }) {
  const res = await productClient[":id"].stock.$patch({ param: { id }, json: { amount } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}
