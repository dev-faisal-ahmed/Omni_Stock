"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-8xl font-black tracking-tighter text-muted-foreground/30">404</h1>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Page Not Found
        </h2>
        <p className="max-w-125 text-muted-foreground text-sm sm:text-base">
          Oops! The page you are looking for doesn&apos;t exist. It might have been moved or deleted.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => router.push("/")}>Return Home</Button>
        </div>
      </div>
    </div>
  );
}
