"use client";

import {
  restockProductSchema,
  TRestockProductForm,
  type TRestockProductFormInput,
} from "../product-schema";
import { FormSheet } from "@/components/form/form-sheet";
import { RestockButton } from "@/components/action-button";
import { usePopupState } from "@/hooks/use-popup-state";
import { useInvalidate } from "@/lib/cache-registry";
import { useMutation } from "@tanstack/react-query";
import { increaseProductStockApi } from "../product-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type TRestockProductProps = {
  id: string;
  currentStock: number;
};

const formId = "restock-product-form";

export function ReStockProduct({ id, currentStock }: TRestockProductProps) {
  const { open, onOpenChange } = usePopupState();
  const { invalidate } = useInvalidate();

  const form = useForm<TRestockProductFormInput, unknown, TRestockProductForm>({
    resolver: zodResolver(restockProductSchema),
    defaultValues: { amount: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: increaseProductStockApi,
    onSuccess() {
      toast.success("Product Restocked Successfully");
      invalidate("products");
      form.reset();
      onOpenChange(false);
    },
  });

  const onReStock = form.handleSubmit((formData) => {
    mutate({ id, amount: formData.amount });
  });

  return (
    <>
      <RestockButton onClick={() => onOpenChange(true)} tooltip={`Restock Product`} />
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title={`Restock Product: ${name}`}
        formId={formId}
        isLoading={isPending}
      >
        <form id={formId} onSubmit={onReStock} className="space-y-4 pt-4">
          <div className="bg-muted/40 mb-4 rounded-lg border border-emerald-500/20 p-4">
            <p className="text-muted-foreground text-sm font-medium">Current Stock</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600">{currentStock}</p>
          </div>
          <FormField control={form.control} name="amount" label="Stock">
            {({ field: { onChange, value, ...field } }) => (
              <Input
                {...field}
                value={value as number}
                onChange={(e) => onChange(e.target.value)}
                type="number"
                min={0}
                placeholder="0"
              />
            )}
          </FormField>
        </form>
      </FormSheet>
    </>
  );
}
