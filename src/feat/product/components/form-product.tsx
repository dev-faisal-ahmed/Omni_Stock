"use client";

import { useForm } from "react-hook-form";
import { SelectInput } from "@/components/form/select-input";
import { productFormSchema, TProductForm, TProductFormInput } from "../product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getAllCategoriesApi } from "@/feat/category/category-api";
import { Textarea } from "@/components/ui/textarea";
import { QK } from "@/lib/cache-registry";

type TProductFormProps = {
  formId: string;
  defaultValues?: Partial<TProductFormInput>;
  onSubmit: (formData: TProductForm) => void;
};

export function ProductForm({ formId, defaultValues, onSubmit }: TProductFormProps) {
  const form = useForm<TProductFormInput, unknown, TProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  return (
    <form id={formId} className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField control={form.control} name="name" label="Name" required>
        {({ field }) => <Input {...field} placeholder="Input Product Name" />}
      </FormField>

      <FormField control={form.control} name="categoryId" label="Category" required>
        {({ field }) => <CategorySelection value={field.value} onChange={field.onChange} />}
      </FormField>

      <FormField control={form.control} name="description" label="Description">
        {({ field }) => <Textarea {...field} placeholder="Input Description (optional)" />}
      </FormField>

      <FormField control={form.control} name="price" label="Price" required>
        {({ field: { onChange, value, ...field } }) => (
          <Input
            {...field}
            value={value as number}
            onChange={(e) => onChange(e.target.value)}
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
          />
        )}
      </FormField>

      <FormField control={form.control} name="stock" label="Stock" required>
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

      <FormField control={form.control} name="minimumThreshold" label="Minimum Threshold" required>
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
  );
}

type TCategorySelectionProps = {
  value: string;
  onChange: (value: string) => void;
};

function CategorySelection({ value, onChange }: TCategorySelectionProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: [QK.categories, "all"],
    queryFn: getAllCategoriesApi,
    select: (res) => {
      return res.data.map((cat) => ({
        label: cat.name,
        value: cat.id,
      }));
    },
  });

  return (
    <SelectInput
      value={value}
      onChange={onChange}
      options={categories ?? []}
      clearable
      isLoading={isLoading}
      placeholder="Select a category"
    />
  );
}
