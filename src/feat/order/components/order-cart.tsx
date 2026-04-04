"use client";

import { useState } from "react";
import { useOrderStore } from "../order-store";
import { createOrderApi } from "../order-api";
import { useMutation } from "@tanstack/react-query";
import { useInvalidate } from "@/lib/cache-registry";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCartIcon } from "@phosphor-icons/react";
import { OrderCartItem } from "./order-cart-item";
import { cn } from "@/lib/utils";

export function OrderCart() {
  const items = useOrderStore((state) => state.items);
  const customerName = useOrderStore((state) => state.customerName);
  const setCustomerName = useOrderStore((state) => state.setCustomerName);
  const removeAll = useOrderStore((state) => state.removeAll);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const { invalidate } = useInvalidate();
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutate: addOrder, isPending } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (data) => {
      toast.success(data.message || "Order added successfully");
      invalidate("orders");
      invalidate("products");
      setValidationError(null);
      removeAll();
    },
  });

  const handleAddOrder = () => {
    setValidationError(null);

    // Validation
    if (!customerName.trim()) return setValidationError("Customer name is required");
    if (!items.length) return setValidationError("Cart is empty");

    const invalidItems = items.filter((item) => item.quantity > item.stock);

    if (invalidItems.length) {
      setValidationError(
        `Quantity exceeds max stock for: ${invalidItems.map((i) => i.name).join(", ")}`,
      );
      return;
    }

    const payload = {
      customerName: customerName.trim(),
      orderInfo: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    addOrder(payload);
  };

  return (
    <div className="bg-card text-card-foreground flex h-[calc(100vh-7.5rem)] flex-col border shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon className="h-5 w-5" />
          <h3 className="font-semibold">Current Order</h3>
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={removeAll}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8"
          >
            Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {!items.length ? (
          // Empty State
          <div className="text-muted-foreground flex flex-col items-center justify-center space-y-3 py-12 text-center">
            <ShoppingCartIcon className="h-12 w-12 opacity-20" />
            <p>Your cart is empty.</p>
            <p className="text-sm">Add products from the list to start an order.</p>
          </div>
        ) : (
          // Cart Items
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <OrderCartItem key={item.productId} item={item} />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="bg-muted/20 flex flex-col space-y-4 border-t p-4">
        {/* Customer Input */}
        <div className="flex flex-col space-y-1.5">
          <Input
            placeholder="Customer Name..."
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className={cn(validationError && "border-destructive focus-visible:ring-destructive")}
            disabled={isPending}
          />
          {validationError && (
            <p className="text-destructive text-[10px] font-medium">{validationError}</p>
          )}
        </div>

        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span className="text-lg">{totalPrice.toFixed(2)} ৳</span>
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={items.length === 0 || isPending || items.some((i) => i.quantity > i.stock)}
          onClick={handleAddOrder}
          isLoading={isPending}
        >
          Add Order
        </Button>
      </div>
    </div>
  );
}
