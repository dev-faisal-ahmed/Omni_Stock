"use client";

import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  TrendUpIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { startOfDay, endOfDay, format } from "date-fns";
import { getOrderSummaryApi } from "@/feat/order/order-api";
import { getLowStockCountApi } from "@/feat/product/product-api";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSummaryFilter } from "./order-summary-filter";
import { QK } from "@/lib/cache-registry";
import { TFilterForm } from "../analytics-schema";
import { MONTH_NAMES } from "../const-analytics";
import { Button } from "@/components/ui/button";

export type TDateRange = {
  startDate: Date;
  endDate: Date;
};

export function Summary() {
  return (
    <div className="space-y-6">
      <OrderSummary />
      <LowStockCount />
    </div>
  );
}

function OrderSummary() {
  const now = new Date();

  const [formState, setFormState] = useState<TFilterForm>({
    mode: "day",
    year: now.getFullYear(),
    date: now,
    month: now.getMonth(),
  });

  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
  });

  const { data: summary, isLoading } = useQuery({
    queryKey: [QK.orders, { type: "summary", dateRange }],
    queryFn: () => getOrderSummaryApi(dateRange),
    select: (res) => res.data,
  });

  const summaryData = summary || {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
  };

  const handleClearAll = () => {
    setFormState({
      mode: "day",
      year: now.getFullYear(),
      date: now,
      month: now.getMonth(),
    });

    setDateRange({ startDate: startOfDay(new Date()), endDate: endOfDay(new Date()) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-semibold">
          {getDateRangeLabel(formState)}
        </h3>

        <div className="flex items-center gap-4">
          <Button variant="destructive" onClick={handleClearAll}>
            Clear
          </Button>
          <OrderSummaryFilter
            onDateRangeChange={setDateRange}
            formState={formState}
            onFormStateUpdate={setFormState}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <SummaryCard
          icon={<ShoppingBagIcon className="h-5 w-5" />}
          title="Total Orders"
          amount={summaryData.totalOrders}
          isLoading={isLoading}
        />
        <SummaryCard
          icon={<ClockIcon className="h-5 w-5" />}
          title="Pending"
          amount={summaryData.pendingOrders}
          isLoading={isLoading}
        />
        <SummaryCard
          icon={<CheckCircleIcon className="h-5 w-5" />}
          title="Delivered"
          amount={summaryData.completedOrders}
          isLoading={isLoading}
        />
        <SummaryCard
          icon={<TrendUpIcon className="h-5 w-5 text-green-500" />}
          title="Revenue"
          amount={`৳${Number(summaryData.revenue).toFixed(2)}`}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function LowStockCount() {
  const { data: response, isLoading } = useQuery({
    queryKey: [QK.products, "low-stock-count"],
    queryFn: () => getLowStockCountApi(),
  });

  const count = response?.data?.count || 0;

  return (
    <div className="grid gap-4">
      <SummaryCard
        icon={<WarningIcon className="h-5 w-5 text-amber-500" />}
        title="Low Stock Items"
        amount={count}
        isLoading={isLoading}
      />
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  amount: string | number;
  isLoading?: boolean;
}

function SummaryCard({ icon, title, amount, isLoading }: SummaryCardProps) {
  return (
    <div className="bg-card border p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-bold">{amount}</p>
          )}
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </div>
  );
}

// Functions
function getDateRangeLabel(formState: TFilterForm) {
  if (formState.mode === "day" && formState.date) return `Date : ${format(formState.date, "PPP")}`;

  if (formState.mode === "month" && formState.month !== undefined && formState.year)
    return `Month : ${MONTH_NAMES[formState.month]} ${formState.year}`;

  if (formState.mode === "year" && formState.year) return `Year : ${formState.year}`;

  return "Select period";
}
