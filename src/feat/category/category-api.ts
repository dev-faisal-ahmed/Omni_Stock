import {
  AddCategoryDto,
  GetCategoriesDto,
  UpdateCategoryInputDto,
} from "@/server/modules/category/category.dto";
import { ToString } from "@/lib/types";
import { categoryClient } from "@/lib/client";

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

export async function updateCategoryApi({ id, ...dto }: UpdateCategoryInputDto & { id: string }) {
  const res = await categoryClient[":id"].$patch({ param: { id }, json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}

export async function deleteCategoryApi(id: string) {
  const res = await categoryClient[":id"].$delete({ param: { id } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}
