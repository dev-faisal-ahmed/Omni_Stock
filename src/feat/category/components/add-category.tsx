import { FormSheet } from "@/components/form/form-sheet";
import { usePopupState } from "@/hooks/use-popup-state";
import { CategoryForm } from "./form-category";
import { TCategoryForm } from "../category-schema";
import { useMutation } from "@tanstack/react-query";
import { addCategoryApi } from "../category-api";
import { toast } from "sonner";
import { useInvalidate } from "@/lib/cache-registry";
import { AddButton } from "@/components/action-button";

const formId = "add-category-form";

const defaultValues: TCategoryForm = {
  name: "",
  slug: "",
};

export function AddCategory() {
  const { open, onOpenChange } = usePopupState();
  const { invalidate } = useInvalidate();

  const { mutate } = useMutation({
    mutationFn: addCategoryApi,
    onSuccess() {
      toast.success("Category Added Successfully");
      invalidate("categories");
      onOpenChange(false);
    },
  });

  const onAddCategory = (formData: TCategoryForm) => {
    mutate({ name: formData.name, slug: formData.slug ?? "" });
  };

  return (
    <>
      <AddButton onClick={() => onOpenChange(true)} />
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Add Category"
        formId={formId}
        preventClose
      >
        <CategoryForm formId={formId} onSubmit={onAddCategory} defaultValues={defaultValues} />
      </FormSheet>
    </>
  );
}
