import { QK } from "@/lib/cache-registry";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsApi } from "./product-api";

export function useAllProducts() {
  return useQuery({
    queryKey: [QK.products, "all"],
    queryFn: getAllProductsApi,
    select: (res) => res.data,
  });
}
