"use client";

import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  setMonth,
  setYear,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSheet } from "@/components/form/form-sheet";
import { Button } from "@/components/ui/button";
import { FunnelIcon } from "@phosphor-icons/react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { filterSchema, TFilterForm } from "../analytics-schema";
import { usePopupState } from "@/hooks/use-popup-state";
import { FormField } from "@/components/form/form-field";
import { SelectInput } from "@/components/form/select-input";
import { FILTER_MODE_OPTIONS, MONTH_NAMES } from "../const-analytics";
import { TDateRange } from "./summary";

type TOrderSummaryFilterProps = {
  onDateRangeChange: (dateRange: TDateRange) => void;
  formState: TFilterForm;
  onFormStateUpdate: (formState: TFilterForm) => void;
};

const formId = "order-summary-filter-form";

export function OrderSummaryFilter({
  formState,
  onDateRangeChange,
  onFormStateUpdate,
}: TOrderSummaryFilterProps) {
  const { open, onOpenChange } = usePopupState();

  const form = useForm<TFilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: formState,
  });

  const onSubmit = form.handleSubmit((formData) => {
    let startDate: Date, endDate: Date;

    if (formData.mode === "day" && formData.date) {
      startDate = startOfDay(formData.date);
      endDate = endOfDay(formData.date);
    } else if (formData.mode === "month" && formData.month !== undefined && formData.year) {
      const monthDate = setMonth(setYear(new Date(), formData.year), formData.month);
      startDate = startOfMonth(monthDate);
      endDate = endOfMonth(monthDate);
    } else if (formData.mode === "year" && formData.year) {
      const yearDate = setYear(new Date(), formData.year);
      startDate = startOfYear(yearDate);
      endDate = endOfYear(yearDate);
    } else {
      // Fallback to today
      startDate = startOfDay(new Date());
      endDate = endOfDay(new Date());
    }

    onFormStateUpdate(formData);
    onDateRangeChange({ startDate, endDate });
    onOpenChange(false);
  });

  const mode = useWatch({ control: form.control, name: "mode" });

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => onOpenChange(true)} className="gap-2">
        <FunnelIcon className="h-4 w-4" />
        Filter
      </Button>

      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Filter Order Summary"
        formId={formId}
      >
        <form id={formId} onSubmit={onSubmit} className="grid gap-4">
          {/* Mode Selection */}
          <FormField control={form.control} name="mode" label="Select Period">
            {({ field }) => (
              <SelectInput
                options={FILTER_MODE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          </FormField>

          {/* Day Mode */}
          {mode === "day" && (
            <FormField control={form.control} name="date" label="Select Date">
              {({ field: { value, onChange } }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      {value?.toLocaleDateString()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={value}
                      onSelect={onChange}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </FormField>
          )}

          {/* Month Mode */}
          {mode === "month" && (
            <>
              <FormField control={form.control} name="month" label="Month">
                {({ field: { value, onChange } }) => (
                  <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {MONTH_NAMES.map((month, idx) => (
                        <SelectItem key={month} value={String(idx)}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>

              <FormField control={form.control} name="year" label="Year">
                {({ field: { value, onChange } }) => (
                  <YearPicker value={value} onChange={onChange} />
                )}
              </FormField>
            </>
          )}

          {/* Year Mode */}
          {mode === "year" && (
            <FormField control={form.control} name="year" label="Year">
              {({ field: { value, onChange } }) => <YearPicker value={value} onChange={onChange} />}
            </FormField>
          )}
        </form>
      </FormSheet>
    </>
  );
}

type TYearPickerProps = {
  value: number;
  onChange: (year: number) => void;
};

function YearPicker({ value, onChange }: TYearPickerProps) {
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger>
        <SelectValue placeholder="Select Year" />
      </SelectTrigger>
      <SelectContent position="popper">
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
