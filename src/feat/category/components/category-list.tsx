"use client";

import { usePagination } from "@/hooks/use-pagination";
import { useSearch } from "@/hooks/use-search";
import { QK } from "@/lib/cache-registry";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../category-api";
import { useMemo } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { SearchInput } from "@/components/form/search-input";
import { AddCategory } from "./add-category";

type TCategoryLocal = Awaited<ReturnType<typeof getCategoriesApi>>["data"][number];
const { accessor: ca } = createColumnHelper<TCategoryLocal>();

export function CategoryList() {
  const { pagination, setPagination } = usePagination();
  const { searchTerm, search, setSearch } = useSearch();

  const page = pagination.page;
  const pageSize = pagination.pageSize;

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [QK.categories, { page, pageSize, searchTerm }],
    queryFn: () =>
      getCategoriesApi({
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
      header={<CategoryListHeader value={search} onChange={setSearch} />}
    />
  );
}

type TCategoryListHeaderProps = {
  value: string;
  onChange(value: string): void;
};

function CategoryListHeader({ value, onChange }: TCategoryListHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <SearchInput value={value} onChange={onChange} placeholder="Search here..." />
      <AddCategory />
    </div>
  );
}
