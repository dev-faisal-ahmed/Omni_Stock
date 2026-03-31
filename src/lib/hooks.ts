"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "./client";
import { QK } from "./cache-registry";

export const useAuth = () => {
  return useQuery({
    queryKey: [QK.auth],
    queryFn: async () => {
      const res = await authClient.me.$get();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data;
    },
    retry: false,
  });
};

export const usePopupState = (defaultOpen = false) => {
  const [open, setOpen] = useState(defaultOpen);
  return { open, onOpenChange: setOpen };
};
