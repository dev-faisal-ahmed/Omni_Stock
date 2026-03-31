import { PackageIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export const AppLogo = () => (
  <div className="flex items-center gap-3 px-1 py-1">
    <div className="bg-primary relative flex size-8 shrink-0 items-center justify-center rounded-xl shadow-md">
      <PackageIcon weight="fill" className="size-4 text-white" />
      <span className="bg-primary-foreground/20 absolute -right-0.5 -top-0.5 size-2 rounded-full" />
    </div>

    <span className="text-foreground text-[15px] font-bold tracking-tight">
      Omni<span className="text-primary">Stock</span>
    </span>
  </div>
);

type TAvatarSize = "XS" | "SM" | "MD" | "LG";

const sizeMap: Record<TAvatarSize, string> = {
  XS: "size-6 text-[10px]",
  SM: "size-8 text-xs",
  MD: "size-10 text-sm",
  LG: "size-12 text-base",
};

type TCommonAvatarProps = {
  name: string;
  size?: TAvatarSize;
  className?: string;
  fallbackClassName?: string;
};

export const CommonAvatar = ({
  name,
  size = "MD",
  className,
  fallbackClassName,
}: TCommonAvatarProps) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizeMap[size],
        fallbackClassName,
        className,
      )}
    >
      {initials}
    </div>
  );
};
