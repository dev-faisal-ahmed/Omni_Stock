"use client";

import { FormSheet } from "@/components/form/form-sheet";
import { UpdateButton } from "@/components/action-button";
import { usePopupState } from "@/hooks/use-popup-state";
import { useInvalidate } from "@/lib/cache-registry";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProductApi } from "../product-api";
import { ProductForm } from "./form-product";
import { TProductForm, TProductFormInput } from "../product-schema";

type TUpdateProductProps = {
  id: string;
  name: string;
  categoryId: string;
  description?: string | null;
  price: number;
  stock: number;
  minimumThreshold: number;
};

const formId = "update-product-form";

export function UpdateProduct({
  id,
  name,
  categoryId,
  description,
  price,
  stock,
  minimumThreshold,
}: TUpdateProductProps) {
  const { open, onOpenChange } = usePopupState();
  const { invalidate } = useInvalidate();

  const { mutate, isPending } = useMutation({
    mutationFn: updateProductApi,
    onSuccess() {
      toast.success("Product Updated Successfully");
      invalidate("products");
      onOpenChange(false);
    },
  });

  const defaultValues: TProductFormInput = {
    name,
    categoryId,
    description: description ?? "",
    price,
    stock,
    minimumThreshold,
  };

  const onUpdateProduct = (formData: TProductForm) => {
    mutate({
      id,
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price,
      minimumThreshold: formData.minimumThreshold,
    });
  };

  return (
    <>
      <UpdateButton onClick={() => onOpenChange(true)} tooltip="Update Product" />
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Update Product"
        formId={formId}
        isLoading={isPending}
        preventClose
      >
        <ProductForm
          formId={formId}
          mode="edit"
          onSubmit={onUpdateProduct}
          defaultValues={defaultValues}
        />
      </FormSheet>
    </>
  );
}
