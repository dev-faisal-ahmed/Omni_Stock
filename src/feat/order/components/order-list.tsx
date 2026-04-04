"use client";

import { DataTable } from "@/components/data-table";
import { QK } from "@/lib/cache-registry";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { getOrdersApi } from "../order-api";
import { OrderStatus } from "@/generated/prisma/enums";
import { OrderListFilter } from "./order-list-filter";
import { UpdateOrderStatus } from "./update-order-status";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

type TOrder = Awaited<ReturnType<typeof getOrdersApi>>["data"][number];
type TCreatedAtSort = "asc" | "desc";

const { accessor } = createColumnHelper<TOrder>();

export function OrderList() {
  const { pagination, setPagination } = usePagination();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });

  const [status, setStatus] = useState<string>("all");
  const [sortByCreatedAt, setSortByCreatedAt] = useState<TCreatedAtSort>("desc");

  const handleClearAll = () => {
    setStatus("all");
    setSortByCreatedAt("desc");
    setDate(undefined);
    setPagination({ page: 1, pageSize: 10 });
  };

  const page = pagination.page;
  const pageSize = pagination.pageSize;

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: [QK.orders, { page, pageSize, status, sortByCreatedAt, date }],
    queryFn: () =>
      getOrdersApi({
        page: String(page),
        limit: String(pageSize),
        sortByCreatedAt,
        ...(status !== "all" && { status: status as OrderStatus }),
        ...(date && {
          ...(date.from && { startDate: date.from.toISOString() }),
          ...(date.to && { endDate: date.to.toISOString() }),
        }),
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
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="w-44">
              <UpdateOrderStatus
                orderId={order.orderId}
                currentStatus={order.orderStatus as OrderStatus}
              />
            </div>
          );
        },
      },
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
        <OrderListFilter
          status={status}
          onStatusChange={setStatus}
          sortByCreatedAt={sortByCreatedAt}
          onSortChange={setSortByCreatedAt}
          date={date}
          setDate={setDate}
          onClearAll={handleClearAll}
        />
      }
      className={{
        body: "h-[calc(100vh-14.5rem)]",
      }}
    />
  );
}
