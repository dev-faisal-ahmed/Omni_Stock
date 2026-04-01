import { useForm } from "react-hook-form";
import { categoryFormSchema, TCategoryForm } from "../category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";

type TCategoryFormProps = {
  formId: string;
  defaultValues?: Partial<TCategoryForm>;
  onSubmit: (formData: TCategoryForm) => void;
};

export function CategoryForm({ formId, defaultValues, onSubmit }: TCategoryFormProps) {
  const form = useForm<TCategoryForm>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  return (
    <form id={formId} className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField control={form.control} name="name" label="Name" required>
        {({ field }) => <Input {...field} placeholder="Input Category Name" />}
      </FormField>

      <FormField control={form.control} name="slug" label="Slug">
        {({ field }) => <Input {...field} placeholder="Input Slug" />}
      </FormField>
    </form>
  );
}
