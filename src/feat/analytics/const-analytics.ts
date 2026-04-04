import { TSelectOption } from "@/components/form/select-input";

export const FILTER_MODES = ["day", "month", "year"] as const;

export const FILTER_MODE_OPTIONS: TSelectOption[] = [
  { label: "Day", value: "day" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
] as const;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type TFilterMode = (typeof FILTER_MODES)[number];
