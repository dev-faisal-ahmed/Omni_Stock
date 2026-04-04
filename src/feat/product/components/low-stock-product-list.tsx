"use client";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";
import { QK } from "@/lib/cache-registry";
import { useQuery } from "@tanstack/react-query";
import { getLowStockProductsApi } from "../product-api";
import { SearchInput } from "@/components/form/search-input";
import { ProductTable } from "./product-table";

export function LowStockProductList() {
  const { pagination, setPagination } = usePagination();
  const { searchTerm, search, setSearch } = useSearch();

  const page = pagination.page;
  const pageSize = pagination.pageSize;

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [QK.products, { page, pageSize, searchTerm, mode: "low-stock" }],
    queryFn: () =>
      getLowStockProductsApi({
        page: String(page),
        limit: String(pageSize),
        ...(searchTerm && { search: searchTerm }),
      }),
  });

  const products = apiResponse?.data || [];
  const meta = apiResponse?.meta;

  return (
    <ProductTable
      products={products}
      isLoading={isLoading}
      pagination={pagination}
      totalPage={meta?.totalPage ?? 0}
      onPaginationChange={setPagination}
      header={<LowStockProductListHeader value={search} onChange={setSearch} />}
      mode="low-stock"
    />
  );
}

type TLowStockProductListHeaderProps = {
  value: string;
  onChange(value: string): void;
};

function LowStockProductListHeader({ value, onChange }: TLowStockProductListHeaderProps) {
  return (
    <div className="flex items-center justify-start gap-4 p-4">
      <SearchInput value={value} onChange={onChange} placeholder="Search low stock products..." />
    </div>
  );
}
