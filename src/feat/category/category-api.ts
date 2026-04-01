import { ToString } from "@/lib/types";
import { categoryClient } from "@/lib/client";
import { GetCategoriesDto } from "@/server/modules/category/category.dto";

export async function getCategories(query: ToString<GetCategoriesDto>) {
  const res = await categoryClient.index.$get({ query });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
}
