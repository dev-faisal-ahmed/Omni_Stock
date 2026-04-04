import z from "zod";
import { FILTER_MODES } from "./const-analytics";

export const filterSchema = z.object({
  mode: z.enum(FILTER_MODES),
  date: z.date().optional(),
  month: z.number().min(0).max(11).optional(),
  year: z.number().min(2000),
});

export type TFilterForm = z.infer<typeof filterSchema>;
