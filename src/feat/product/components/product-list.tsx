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
import { UpdateProduct } from "./update-product";

type TProductLocal = Awaited<ReturnType<typeof getProductsApi>>["data"][number];
const { accessor } = createColumnHelper<TProductLocal>();

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
      accessor("name", { header: "Name" }),
      {
        header: "Category",
        cell: ({ row }) => row.original.category.name,
      },
      accessor("price", {
        header: "Price",
        cell: ({ getValue }) => `${getValue().toFixed(2)} ৳`,
      }),
      accessor("stock", { header: "Stock" }),
      accessor("minimumThreshold", { header: "Min. Threshold" }),
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const { stock } = row.original;

          if (stock > 0) return <span className="text-green-500">Active</span>;
          return <span className="text-red-500">Out of Stock</span>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <UpdateProduct
              id={row.original.id}
              name={row.original.name}
              categoryId={row.original.categoryId}
              description={row.original.description}
              price={row.original.price}
              stock={row.original.stock}
              minimumThreshold={row.original.minimumThreshold}
            />
          </div>
        ),
      },
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
