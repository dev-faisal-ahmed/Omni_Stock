"use client";

import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { ProductDetails } from "./product-details";
import { ReStockProduct } from "./re-stock-product";
import { UpdateProduct } from "./update-product";
import { DeleteProduct } from "./delete-product";

type TProductLocal = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  minimumThreshold: number;
  categoryId: string;
  category?: { id: string; name: string } | null;
};
type TProductTableMode = "all" | "low-stock";

const { accessor } = createColumnHelper<TProductLocal>();

type TProductTableProps = {
  products: TProductLocal[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
  };
  totalPage: number;
  onPaginationChange: (pagination: { page: number; pageSize: number }) => void;
  header: React.ReactNode;
  mode?: TProductTableMode;
};

export function ProductTable({
  products,
  isLoading,
  pagination,
  totalPage,
  onPaginationChange,
  header,
  mode = "all",
}: TProductTableProps) {
  const { page, pageSize } = pagination;

  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "SN",
        cell: ({ row }: { row: Row<TProductLocal> }) => {
          const offset = (page - 1) * pageSize;
          return `#${offset + row.index + 1}`;
        },
      },
      accessor("name", { header: "Name" }),
      {
        header: "Category",
        cell: ({ row }: { row: Row<TProductLocal> }) => row.original.category?.name || "N/A",
      },
      accessor("price", {
        header: "Price",
        cell: (context) => `${(context.getValue() as number).toFixed(2)} ৳`,
      }),
      accessor("stock", { header: "Stock" }),
      accessor("minimumThreshold", { header: "Min. Threshold" }),
      {
        id: "status",
        header: "Status",
        cell: ({ row }: { row: Row<TProductLocal> }) => {
          const { stock } = row.original;

          if (stock > 0) return <span className="text-green-500">Active</span>;
          return <span className="text-red-500">Out of Stock</span>;
        },
      },
      {
        id: "actions",
        cell: ({ row }: { row: Row<TProductLocal> }) => {
          if (mode === "low-stock") {
            return (
              <div className="flex items-center justify-end gap-2">
                <ProductDetails product={row.original} />
                <ReStockProduct id={row.original.id} currentStock={row.original.stock} />
              </div>
            );
          }

          return (
            <div className="flex items-center justify-end gap-2">
              <ProductDetails product={row.original} />
              <ReStockProduct id={row.original.id} currentStock={row.original.stock} />
              <UpdateProduct
                id={row.original.id}
                name={row.original.name}
                categoryId={row.original.categoryId}
                description={row.original.description}
                price={row.original.price}
                stock={row.original.stock}
                minimumThreshold={row.original.minimumThreshold}
              />
              <DeleteProduct id={row.original.id} />
            </div>
          );
        },
      },
    ] as ColumnDef<TProductLocal>[];

    return baseColumns;
  }, [page, pageSize, mode]);

  return (
    <DataTable
      columns={columns}
      data={products}
      onPaginationChangeAction={onPaginationChange}
      pagination={pagination}
      totalPage={totalPage}
      isLoading={isLoading}
      header={header}
      className={{
        body: "h-[calc(100vh-14.5rem)]",
      }}
    />
  );
}
