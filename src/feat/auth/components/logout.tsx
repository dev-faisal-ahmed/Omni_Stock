"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SignOutIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/client";
import { useInvalidate } from "@/lib/cache-registry";

export const Logout = () => {
  const router = useRouter();
  const { invalidate } = useInvalidate();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await authClient.logout.$post();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    onSuccess() {
      invalidate("auth");
      router.push("/login");
    },
  });

  return (
    <Button
      variant="ghost"
      className="text-destructive hover:text-destructive w-full cursor-pointer justify-start px-4 py-2"
      disabled={isPending}
      onClick={() => mutate()}
    >
      <SignOutIcon />
      {isPending ? "Logging out..." : "Log out"}
    </Button>
  );
};
