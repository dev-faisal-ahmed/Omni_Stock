"use client";

import { useMutation } from "@tanstack/react-query";
import { SignOutIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useInvalidate } from "@/lib/cache-registry";
import { logoutApi } from "../auth-api";

export const Logout = () => {
  const { invalidateAll } = useInvalidate();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess() {
      invalidateAll();
    },
  });

  return (
    <Button
      variant="ghost"
      className="text-destructive hover:text-destructive w-full cursor-pointer justify-start px-4 py-2"
      isLoading={isPending}
      onClick={() => mutate()}
    >
      <SignOutIcon />
      Logout
    </Button>
  );
};
