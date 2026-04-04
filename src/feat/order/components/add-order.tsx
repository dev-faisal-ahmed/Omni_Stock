import { OrderProductList } from "./order-product-list";

export function AddOrder() {
  return (
    <section className="grid md:grid-cols-2 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <OrderProductList />
      </div>

      {/* Order Cart */}
    </section>
  );
}
