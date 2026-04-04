import Link from "next/link";

import { SelectInput } from "@/components/form/select-input";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/generated/prisma/enums";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FunnelSimpleXIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ToolTipContainer } from "@/components/tooltip-container";

type TOrderListFilterProps = {
  status: string;
  onStatusChange(value: string): void;
  sortByCreatedAt: "asc" | "desc";
  onSortChange(value: "asc" | "desc"): void;
  date: DateRange | undefined;
  setDate(date: DateRange | undefined): void;
  onClearAll(): void;
};

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Confirmed", value: OrderStatus.CONFIRMED },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];

const sortOptions = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
];

export function OrderListFilter({
  status,
  onStatusChange,
  sortByCreatedAt,
  onSortChange,
  date,
  setDate,
  onClearAll,
}: TOrderListFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <div className="grid w-full gap-4 sm:w-auto sm:grid-cols-2">
        <div className="w-full sm:w-48">
          <SelectInput value={status} onChange={onStatusChange} options={statusOptions} />
        </div>

        <div className="w-full sm:w-48">
          <SelectInput
            value={sortByCreatedAt}
            onChange={(value) => onSortChange(value as "asc" | "desc")}
            options={sortOptions}
          />
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <ToolTipContainer label="Clear Filter">
        <Button
          variant="outline"
          className="text-destructive border-destructive dark:border-destructive/50 hover:bg-destructive dark:hover:bg-destructive hover:text-white"
          onClick={onClearAll}
        >
          <FunnelSimpleXIcon />
        </Button>
      </ToolTipContainer>
      <div className="ml-auto flex items-center gap-2">
        <Button asChild>
          <Link href="/orders/new">Add New</Link>
        </Button>
      </div>
    </div>
  );
}
