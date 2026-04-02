import { DeleteButton } from "@/components/action-button";
import { DeleteDialog } from "@/components/delete-dialog";
import { usePopupState } from "@/hooks/use-popup-state";
import { useMutation } from "@tanstack/react-query";
import { deleteCategoryApi } from "../category-api";
import { useInvalidate } from "@/lib/cache-registry";
import { toast } from "sonner";

type TDeleteCategoryProps = {
  id: string;
};

export function DeleteCategory({ id }: TDeleteCategoryProps) {
  const { invalidate } = useInvalidate();
  const { open, onOpenChange } = usePopupState();

  const { mutate } = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess() {
      toast.success("Category Deleted Successfully");
      invalidate("categories");
      onOpenChange(false);
    },
  });

  return (
    <>
      <DeleteButton tooltip="Delete category" onClick={() => onOpenChange(true)} />
      <DeleteDialog open={open} onOpenChange={onOpenChange} onDelete={() => mutate(id)} />
    </>
  );
}
