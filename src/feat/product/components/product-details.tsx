"use client";

import { DetailsSheet } from "@/components/details-sheet";
import { Separator } from "@/components/ui/separator";
import { getProductsApi } from "../product-api";

type TProductLocal = Awaited<ReturnType<typeof getProductsApi>>["data"][number];

type TProductDetailsProps = {
  product: TProductLocal;
};

export function ProductDetails({ product }: TProductDetailsProps) {
  const isLowStock = product.stock <= product.minimumThreshold;
  const isOutOfStock = product.stock <= 0;

  const statusColor = isOutOfStock
    ? "bg-red-500/10 text-red-500"
    : isLowStock
      ? "bg-yellow-500/10 text-yellow-500"
      : "bg-green-500/10 text-green-500";

  const statusText = isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock";

  return (
    <DetailsSheet title="Product Details" tooltip="View Product Details">
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex max-w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}
            >
              {statusText}
            </span>
            <span className="text-muted-foreground text-sm font-medium">
              {product.category.name}
            </span>
          </div>
        </div>

        <Separator />

        {product.description && (
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm font-medium">Description</span>
            <p className="text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="bg-muted/40 grid grid-cols-2 gap-4 rounded-lg p-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium">Price</span>
            <span className="text-lg font-semibold">{product.price.toFixed(2)} ৳</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium">Stock Level</span>
            <span className="text-lg font-semibold">{product.stock} units</span>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium">Minimum Threshold</span>
            <span className="text-sm font-medium">{product.minimumThreshold} units</span>
          </div>
        </div>
      </div>
    </DetailsSheet>
  );
}
