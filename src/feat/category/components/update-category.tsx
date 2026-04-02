import { FormSheet } from "@/components/form/form-sheet";
import { usePopupState } from "@/hooks/use-popup-state";
import { CategoryForm } from "./form-category";
import { TCategoryForm } from "../category-schema";
import { useMutation } from "@tanstack/react-query";
import { updateCategoryApi } from "../category-api";
import { useInvalidate } from "@/lib/cache-registry";
import { UpdateButton } from "@/components/action-button";
import { toast } from "sonner";

type TUpdateCategoryProps = {
  id: string;
  name: string;
  slug: string;
};

const formId = "update-category-form";

export function UpdateCategory({ id, name, slug }: TUpdateCategoryProps) {
  const { open, onOpenChange } = usePopupState();
  const { invalidate } = useInvalidate();

  const { mutate } = useMutation({
    mutationFn: updateCategoryApi,
    onSuccess() {
      toast.success("Category Updated Successfully");
      invalidate("categories");
      onOpenChange(false);
    },
  });

  const onUpdateCategory = (formData: TCategoryForm) => {
    mutate({ id, name: formData.name, ...(formData.slug ? { slug: formData.slug } : {}) });
  };

  return (
    <>
      <UpdateButton onClick={() => onOpenChange(true)} tooltip="Update Category" />
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Update Category"
        formId={formId}
        preventClose
      >
        <CategoryForm formId={formId} onSubmit={onUpdateCategory} defaultValues={{ name, slug }} />
      </FormSheet>
    </>
  );
}
