"use client";

import { FormSheet } from "@/components/form/form-sheet";
import { usePopupState } from "@/hooks/use-popup-state";
import { ProductForm } from "./form-product";
import { TProductForm, TProductFormInput } from "../product-schema";
import { useMutation } from "@tanstack/react-query";
import { addProductApi } from "../product-api";
import { useInvalidate } from "@/lib/cache-registry";
import { AddButton } from "@/components/action-button";
import { toast } from "sonner";

const formId = "add-product-form";

const defaultValues: TProductFormInput = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  stock: "",
  minimumThreshold: "",
};

export function AddProduct() {
  const { open, onOpenChange } = usePopupState();
  const { invalidate } = useInvalidate();

  const { mutate, isPending } = useMutation({
    mutationFn: addProductApi,
    onSuccess() {
      toast.success("Product Added Successfully");
      invalidate("products");
      invalidate("activities");
      onOpenChange(false);
    },
  });

  const onAddProduct = (formData: TProductForm) => {
    mutate(formData);
  };

  return (
    <>
      <AddButton onClick={() => onOpenChange(true)} />
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Add Product"
        formId={formId}
        isLoading={isPending}
        preventClose
      >
        <ProductForm
          formId={formId}
          mode="add"
          onSubmit={onAddProduct}
          defaultValues={defaultValues}
        />
      </FormSheet>
    </>
  );
}
