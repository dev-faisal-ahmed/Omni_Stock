import { QK } from "@/lib/cache-registry";
import { useQuery } from "@tanstack/react-query";
import { meApi } from "./auth-api";

export function useAuth() {
  return useQuery({
    queryKey: [QK.auth],
    queryFn: meApi,
    retry: false,
  });
}
