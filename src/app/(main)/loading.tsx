import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Spinner className="size-8" />
        <p className="text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
