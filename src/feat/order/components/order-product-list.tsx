"use client";

import Link from "next/link";

import { useState } from "react";
import { useAllProducts } from "@/feat/product/product-hook";
import { useOrderStore } from "../order-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MagnifyingGlassIcon, PackageIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function OrderProductList() {
  const { data: products, isLoading } = useAllProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const addItem = useOrderStore((state) => state.addItem);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 border border-dashed p-8 text-center">
        <PackageIcon className="text-muted-foreground h-10 w-10" />
        <div>
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground text-sm">Get started by adding a new product.</p>
        </div>
        <Button asChild>
          <Link href="/products">Add Product</Link>
        </Button>
      </div>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col space-y-4">
      <div className="relative">
        <MagnifyingGlassIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <OrderProductCard key={product.id} product={product} onAdd={addItem} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-muted-foreground col-span-full py-8 text-center">
              No products match your search.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

type TOrderProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    minimumThreshold: number;
  };
  onAdd: (item: { productId: string; name: string; price: number }, stock: number) => void;
};

function OrderProductCard({ product, onAdd }: TOrderProductCardProps) {
  const isOutOfStock = product.stock === 0;

  const getStockBadgeColor = () => {
    if (product.stock === 0) return "bg-destructive/10 text-destructive";
    if (product.stock <= product.minimumThreshold) return "bg-destructive/10 text-destructive";
    return "bg-emerald-500/10 text-emerald-500";
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    onAdd(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
      },
      product.stock,
    );
  };

  return (
    <div
      onClick={handleAddToCart}
      className={cn(
        "group hover:border-primary border-border bg-card text-card-foreground relative flex cursor-pointer flex-col space-y-4 border p-4 transition-all hover:shadow-sm",
        isOutOfStock && "pointer-events-none opacity-50 grayscale sm:grayscale-0",
      )}
    >
      <div className="bg-secondary/50 text-secondary-foreground flex size-10 shrink-0 items-center justify-center">
        <PackageIcon className="h-5 w-5" weight="duotone" />
      </div>

      <h4 className="line-clamp-2 flex-1 leading-tight font-medium">{product.name}</h4>

      <div className="flex flex-col space-y-3 pt-2">
        {/* Price and Stock side by side */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-foreground font-semibold">{product.price.toFixed(2)} ৳</p>
          <div
            className={cn(
              "inline-flex shrink-0 items-center justify-center px-2 py-0.5 text-xs font-medium whitespace-nowrap",
              getStockBadgeColor(),
            )}
          >
            {isOutOfStock ? "Out of stock" : `Stock: ${product.stock}`}
          </div>
        </div>
      </div>
    </div>
  );
}
