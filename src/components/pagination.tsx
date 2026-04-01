"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type TPaginationProps = {
  pagination: TPagination;
  onPaginationChangeAction: (pagination: TPagination) => void;
  totalPage: number;
  pageSizeOptions?: number[];
};

export type TPagination = {
  page: number;
  pageSize: number;
};

export function Pagination({
  pagination,
  onPaginationChangeAction,
  totalPage,
  pageSizeOptions = [10, 20, 30, 50, 100],
}: TPaginationProps) {
  const currentPage = pagination.page;
  const pageSize = pagination.pageSize;

  // Generate page numbers with smart pagination
  // Shows: 1 ... [5 pages around current] ... last
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = totalPage;
    const currentPageNum = currentPage;
    const offset = 2; // Pages before and after current (2 before, current, 2 after = 5 total)

    // Always add first page
    pages.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, currentPageNum - offset);
    const endPage = Math.min(totalPages - 1, currentPageNum + offset);

    // Add ellipsis if there's a gap from 1
    if (startPage > 2) {
      pages.push("...");
    }

    // Add pages around current
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if there's a gap before last
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always add last page if total pages > 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageSizeChange = (value: string) => {
    onPaginationChangeAction({
      page: 1, // Reset to first page when changing page size
      pageSize: Number(value),
    });
  };

  const handlePageChange = (page: number) => {
    onPaginationChangeAction({
      page,
      pageSize,
    });
  };

  return (
    <div className="bg-muted flex w-full items-center space-x-6 border-t px-4 py-2 lg:space-x-8">
      <div className="text-sm font-medium">
        Page {currentPage} of {totalPage}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="h-8 w-18">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm">
                ...
              </span>
            );
          }

          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(pageNum as number)}
            >
              {pageNum}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
