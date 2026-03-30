import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  label?: string | ReactNode;
  description?: string;
  showMessage?: boolean;
  children: ControllerProps<TFieldValues, TName>["render"];
  required?: boolean;
  className?: {
    container?: string;
  };
};

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  label,
  showMessage = true,
  children,
  required,
  className,
  ...props
}: TFormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => (
        <Field aria-invalid={fieldState.invalid} className={cn(className?.container)}>
          <FieldLabel id={field.name} className="font-semibold">
            {label}
            {required && <span className="text-destructive -ml-1">*</span>}
          </FieldLabel>
          {children({ field, fieldState, formState })}
          {showMessage && fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
