"use client";

import { useEffect } from "react";
import { OrderCart } from "./order-cart";
import { OrderProductList } from "./order-product-list";
import { useOrderStore } from "../order-store";

export function AddOrder() {
  const removeAll = useOrderStore((state) => state.removeAll);

  useEffect(() => {
    return () => removeAll();
  }, [removeAll]);

  return (
    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <OrderProductList />
      </div>
      <OrderCart />
    </section>
  );
}
