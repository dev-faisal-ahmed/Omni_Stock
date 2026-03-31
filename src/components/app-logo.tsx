import { PackageIcon } from "@phosphor-icons/react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-3 px-1 py-1">
      <div className="bg-primary relative flex size-8 shrink-0 items-center justify-center rounded-xl shadow-md">
        <PackageIcon weight="fill" className="size-4 text-white" />
        <span className="bg-primary-foreground/20 absolute -top-0.5 -right-0.5 size-2 rounded-full" />
      </div>

      <span className="text-foreground text-[15px] font-bold tracking-tight">
        Omni<span className="text-primary">Stock</span>
      </span>
    </div>
  );
}
