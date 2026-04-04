import { ActivityList } from "@/feat/analytics/components/activity-list";
import { ProductSummary } from "@/feat/analytics/components/product-summary";
import { Summary } from "@/feat/analytics/components/summary";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Summary />
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <ProductSummary />
        <ActivityList />
      </div>
    </div>
  );
}
