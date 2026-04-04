"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircleIcon, WarningIcon } from "@phosphor-icons/react";
import { getProductSummaryApi } from "@/feat/product/product-api";
import { QK } from "@/lib/cache-registry";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProductSummary() {
  const { data: response, isLoading } = useQuery({
    queryKey: [QK.products, "summary"],
    queryFn: getProductSummaryApi,
  });

  const products = response?.data || [];

  return (
    <div className="mt-4 space-y-4">
      <h2 className="font-semibold">Latest 10 Products</h2>
      <div className="border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                  Stock
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-muted-foreground px-4 py-6 text-center text-sm">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 border-b last:border-0">
                    <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-sm">{product.stock}</td>
                    <td className="px-4 py-3">
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                          product.status === "ok"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700",
                        )}
                      >
                        {product.status === "ok" ? (
                          <CheckCircleIcon className="h-3 w-3" weight="fill" />
                        ) : (
                          <WarningIcon className="h-3 w-3" weight="fill" />
                        )}
                        {product.status === "ok" ? "OK" : "Low Stock"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
