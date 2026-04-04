"use client";

import { DataTable } from "@/components/data-table";
import { SelectInput } from "@/components/form/select-input";
import { Button } from "@/components/ui/button";
import { QK } from "@/lib/cache-registry";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getOrdersApi } from "../order-api";
import { OrderStatus } from "@/generated/prisma/enums";

type TOrder = Awaited<ReturnType<typeof getOrdersApi>>["data"][number];
type TCreatedAtSort = "asc" | "desc";

const { accessor } = createColumnHelper<TOrder>();

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Confirmed", value: OrderStatus.CONFIRMED },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];

const sortOptions = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
];

export function OrderList() {
  const { pagination, setPagination } = usePagination();
  const [status, setStatus] = useState<string>("all");
  const [sortByCreatedAt, setSortByCreatedAt] = useState<TCreatedAtSort>("desc");

  const page = pagination.page;
  const pageSize = pagination.pageSize;

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [QK.orders, { page, pageSize, status, sortByCreatedAt }],
    queryFn: () =>
      getOrdersApi({
        page: String(page),
        limit: String(pageSize),
        sortByCreatedAt,
        ...(status !== "all" && { status: status as OrderStatus }),
      }),
  });

  const orders = apiResponse?.data || [];
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
      accessor("orderId", { header: "Order ID" }),
      accessor("customerName", { header: "Customer" }),
      accessor("totalPrice", {
        header: "Total",
        cell: ({ getValue }) => `${getValue().toFixed(2)} ৳`,
      }),
      accessor("orderStatus", {
        header: "Status",
        cell: ({ getValue }) => (
          <span className="bg-muted inline-flex min-w-24 justify-center px-2 py-1 text-xs font-medium">
            {getValue()}
          </span>
        ),
      }),
      accessor("createdAt", {
        header: "Created At",
        cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
      }),
    ] as ColumnDef<TOrder>[];
  }, [page, pageSize]);

  return (
    <DataTable
      columns={columns}
      data={orders}
      onPaginationChangeAction={setPagination}
      pagination={pagination}
      totalPage={meta?.totalPage ?? 0}
      isLoading={isLoading}
      header={
        <OrderListHeader
          status={status}
          onStatusChange={setStatus}
          sortByCreatedAt={sortByCreatedAt}
          onSortChange={setSortByCreatedAt}
        />
      }
      className={{
        body: "h-[calc(100vh-14.5rem)]",
      }}
    />
  );
}

type TOrderListHeaderProps = {
  status: string;
  onStatusChange(value: string): void;
  sortByCreatedAt: TCreatedAtSort;
  onSortChange(value: TCreatedAtSort): void;
};

function OrderListHeader({
  status,
  onStatusChange,
  sortByCreatedAt,
  onSortChange,
}: TOrderListHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="grid w-full gap-4 sm:w-auto sm:grid-cols-2">
        <div className="w-full sm:w-48">
          <SelectInput value={status} onChange={onStatusChange} options={statusOptions} />
        </div>

        <div className="w-full sm:w-48">
          <SelectInput
            value={sortByCreatedAt}
            onChange={(value) => onSortChange(value as TCreatedAtSort)}
            options={sortOptions}
          />
        </div>
      </div>

      <Button asChild>
        <Link href="/orders/new">Add New</Link>
      </Button>
    </div>
  );
}
