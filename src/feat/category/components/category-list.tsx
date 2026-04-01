"use client";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";
import { QK } from "@/lib/cache-registry";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../category-api";
import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

type TCategoryLocal = Awaited<ReturnType<typeof getCategories>>["data"][number];
const { accessor: ca } = createColumnHelper<TCategoryLocal>();

export function CategoryList() {
  const { pagination, setPagination } = usePagination();
  const { searchTerm } = useSearch();

  const page = pagination.page;
  const pageSize = pagination.pageSize;

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [QK.categories, { page, pageSize, searchTerm }],
    queryFn: () =>
      getCategories({
        page: String(page),
        limit: String(pageSize),
        ...(searchTerm && { search: searchTerm }),
      }),
  });

  const categories = apiResponse?.data || [];
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
      ca("name", { header: "Name" }),
      ca("slug", { header: "Slug" }),
      ca("productsCount", { header: "Products" }),
    ] as ColumnDef<TCategoryLocal>[];
  }, [page, pageSize]);

  return (
    <DataTable
      columns={columns}
      data={categories}
      onPaginationChangeAction={setPagination}
      pagination={pagination}
      totalPage={meta?.totalPage ?? 0}
      isLoading={isLoading}
    />
  );
}

function CategoryListHeader() {
  return <></>;
}
