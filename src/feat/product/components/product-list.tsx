"use client";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";
import { QK } from "@/lib/cache-registry";
import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../product-api";
import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { SearchInput } from "@/components/form/search-input";
import { AddProduct } from "./add-product";

type TProductLocal = Awaited<ReturnType<typeof getProductsApi>>["data"][number];
const { accessor: pa } = createColumnHelper<TProductLocal>();

export function ProductList() {
  const { pagination, setPagination } = usePagination();
  const { searchTerm, search, setSearch } = useSearch();

  const page = pagination.page;
  const pageSize = pagination.pageSize;

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [QK.products, { page, pageSize, searchTerm }],
    queryFn: () =>
      getProductsApi({
        page: String(page),
        limit: String(pageSize),
        ...(searchTerm && { search: searchTerm }),
      }),
  });

  const products = apiResponse?.data || [];
  const meta = apiResponse?.meta;

  const columns = useMemo(() => {
    return [
      {
        header: "SN",
        cell: ({ row }) => {
          const offset = (page - 1) * pageSize;
          return `#${offset + row.index + 1}`;
        },
      },
      pa("name", { header: "Name" }),
      {
        header: "Category",
        cell: ({ row }) => row.original.category.name,
      },
      pa("price", {
        header: "Price",
        cell: ({ getValue }) => `$${getValue().toFixed(2)}`,
      }),
      pa("stock", { header: "Stock" }),
      pa("minimumThreshold", { header: "Min. Threshold" }),
      pa("status", { header: "Status" }),
    ] as ColumnDef<TProductLocal>[];
  }, [page, pageSize]);

  return (
    <DataTable
      columns={columns}
      data={products}
      onPaginationChangeAction={setPagination}
      pagination={pagination}
      totalPage={meta?.totalPage ?? 0}
      isLoading={isLoading}
      header={<ProductListHeader value={search} onChange={setSearch} />}
    />
  );
}

type TProductListHeaderProps = {
  value: string;
  onChange(value: string): void;
};

function ProductListHeader({ value, onChange }: TProductListHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <SearchInput value={value} onChange={onChange} placeholder="Search products..." />
      <AddProduct />
    </div>
  );
}
