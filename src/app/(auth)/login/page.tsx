import { Login } from "@/feat/auth/components/login";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
