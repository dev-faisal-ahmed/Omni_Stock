"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type TErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: TErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      <div className="space-y-4">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground mx-auto max-w-125 text-sm">
          An unexpected error occurred while loading this page. We&apos;ve been notified and are
          looking into it.
        </p>
        <div className="pt-4">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
