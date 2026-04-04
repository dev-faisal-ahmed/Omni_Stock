"use client";

import { useState } from "react";
import { TOrderItem, useOrderStore } from "../order-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon, PlusIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type TOrderCartItemProps = {
  item: TOrderItem;
};

export function OrderCartItem({ item }: TOrderCartItemProps) {
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeItem = useOrderStore((state) => state.removeItem);

  const [inputValue, setInputValue] = useState(item.quantity.toString());
  const [prevQuantity, setPrevQuantity] = useState(item.quantity);

  // Derive error cleanly from single source of truth
  const isError = item.quantity > item.stock;

  // Sync state during render when quantity changes from outside 
  if (item.quantity !== prevQuantity) {
    setPrevQuantity(item.quantity);
    setInputValue(item.quantity.toString());
  }

  const onQuantityUpdate = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setInputValue(item.quantity.toString());
      return;
    }
    
    updateQuantity(item.productId, parsed, item.stock);
  };

  return (
    <div className="flex flex-col space-y-2 rounded-md border p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="line-clamp-2 text-sm font-medium">{item.name}</h4>
          <p className="text-muted-foreground text-xs">{item.price.toFixed(2)} ৳</p>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => removeItem(item.productId)}
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon-xs"
            className="size-6 rounded-r-none border-r-0"
            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.stock)}
          >
            <MinusIcon className="size-4" />
          </Button>

            <Input
            type="number"
            className={cn(
              "text-foreground h-6 w-20 rounded-none border text-center text-xs shadow-none focus-visible:ring-0",
              isError && "border-destructive text-destructive focus-visible:border-destructive",
            )}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={onQuantityUpdate}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
          />

          <Button
            variant="outline"
            size="icon-xs"
            className="size-6 rounded-l-none border-l-0"
            disabled={item.quantity >= item.stock}
            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.stock)}
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} ৳</p>
      </div>

      {isError && <span className="text-destructive text-xs font-medium">Only {item.stock} in stock</span>}
    </div>
  );
}
