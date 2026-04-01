import { useState } from "react";
import { TPagination } from "@/components/pagination";

export function usePagination() {
  const [pagination, setPagination] = useState<TPagination>({ page: 1, pageSize: 10 });
  const getTotalPage = (totalItems: number) => Math.ceil(totalItems / pagination.pageSize);

  return {
    pagination,
    setPagination,
    offset: (pagination.page - 1) * pagination.pageSize,
    getTotalPage,
  };
}