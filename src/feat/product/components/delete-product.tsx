"use client";

import { DeleteButton } from "@/components/action-button";
import { DeleteDialog } from "@/components/delete-dialog";
import { usePopupState } from "@/hooks/use-popup-state";
import { useInvalidate } from "@/lib/cache-registry";
import { useMutation } from "@tanstack/react-query";
import { deleteProductApi } from "../product-api";
import { toast } from "sonner";

type TDeleteProductProps = {
  id: string;
};

export function DeleteProduct({ id }: TDeleteProductProps) {
  const { invalidate } = useInvalidate();
  const { open, onOpenChange } = usePopupState();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProductApi,
    onSuccess() {
      toast.success("Product Deleted Successfully");
      invalidate("products");
      onOpenChange(false);
    },
  });

  return (
    <>
      <DeleteButton tooltip="Delete product" onClick={() => onOpenChange(true)} />
      <DeleteDialog
        open={open}
        onOpenChange={onOpenChange}
        onDelete={() => mutate(id)}
        isLoading={isPending}
      />
    </>
  );
}
