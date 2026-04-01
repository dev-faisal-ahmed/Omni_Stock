"use client";
"use no memo";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TPagination } from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";

type TDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  header?: React.ReactNode;
  isLoading?: boolean;
  message?: string;
  pagination: TPagination;
  onPaginationChangeAction: (pagination: TPagination) => void;
  totalPage: number;
  pageSizeOptions?: number[];
  className?: {
    container?: string;
    body?: string;
  };
};

export function DataTable<TData, TValue>({
  columns,
  data,
  header,
  isLoading,
  message,
  pagination,
  onPaginationChangeAction,
  totalPage,
  pageSizeOptions = [5, 10, 20, 30, 50, 100],
  className,
}: TDataTableProps<TData, TValue>) {
  //eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border", className?.container)}>
      {header && <div className="mb-4">{header}</div>}
      <ScrollArea className={cn(className?.body, "grow")} disableScrollbar>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder && null}
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <DataTableBody table={table} columns={columns} isLoading={isLoading} message={message} />
        </Table>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Pagination
        pagination={pagination}
        onPaginationChangeAction={onPaginationChangeAction}
        totalPage={totalPage}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}

type TDataTableBodyProps<TData, TValue> = {
  table: ReturnType<typeof useReactTable<TData>>;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  message?: string;
};

function DataTableBody<TData, TValue>({
  table,
  columns,
  isLoading,
  message = "No results.",
}: TDataTableBodyProps<TData, TValue>) {
  // Handle loading state
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: columns.length }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  // Handle empty state
  const rows = table.getRowModel().rows;
  if (!rows?.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columns.length} className="py-16 text-center">
            {message}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // Return table body with data
  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
