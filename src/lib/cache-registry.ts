import { useQueryClient } from "@tanstack/react-query";

export const QK = {
  auth: "auth",
} as const;

type TKey = (typeof QK)[keyof typeof QK];

export const useInvalidate = () => {
  const qc = useQueryClient();

  const invalidate = (...keys: TKey[]) => {
    keys.forEach((key) => qc.invalidateQueries({ queryKey: [key] }));
  };

  return { invalidate };
};
