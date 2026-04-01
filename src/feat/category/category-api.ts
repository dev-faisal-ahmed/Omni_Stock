import { ToString } from "@/lib/types";
import { categoryClient } from "@/lib/client";
import { AddCategoryDto, GetCategoriesDto } from "@/server/modules/category/category.dto";

export async function addCategoryApi(dto: AddCategoryDto) {
  const res = await categoryClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}

export async function getCategoriesApi(query: ToString<GetCategoriesDto>) {
  const res = await categoryClient.index.$get({ query });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}
