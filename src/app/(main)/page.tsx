import { ProductSummary } from "@/feat/analytics/components/product-summary";
import { Summary } from "@/feat/analytics/components/summary";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Summary />
      <div className="grid gap-4 lg:grid-cols-2">
        <ProductSummary />
      </div>
    </div>
  );
}
