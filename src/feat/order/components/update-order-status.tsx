"use client";

import { SelectInput } from "@/components/form/select-input";
import { OrderStatus } from "@/generated/prisma/enums";
import { useInvalidate } from "@/lib/cache-registry";
import { useMutation } from "@tanstack/react-query";
import { updateOrderStatusApi } from "../order-api";
import { toast } from "sonner";

const statusOptions = [
  { label: "Pending", value: OrderStatus.PENDING },
  { label: "Confirmed", value: OrderStatus.CONFIRMED },
  { label: "Shipped", value: OrderStatus.SHIPPED },
  { label: "Delivered", value: OrderStatus.DELIVERED },
  { label: "Cancelled", value: OrderStatus.CANCELLED },
];

type TUpdateOrderStatusProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export function UpdateOrderStatus({ orderId, currentStatus }: TUpdateOrderStatusProps) {
  const { invalidate } = useInvalidate();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatusApi(orderId, status),
    onSuccess(data) {
      toast.success(data.message);
      invalidate("orders");
      invalidate("activities");
    },
  });

  const handleStatusChange = (status: string) => {
    if (status !== currentStatus) {
      updateStatus(status as OrderStatus);
    }
  };

  return (
    <SelectInput
      value={currentStatus}
      onChange={handleStatusChange}
      options={statusOptions}
      isLoading={isPending}
    />
  );
}
