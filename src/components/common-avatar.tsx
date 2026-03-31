import { cn } from "@/lib/utils";

type TCommonAvatarProps = {
  name: string;
  size?: TAvatarSize;
  className?: string;
  fallbackClassName?: string;
};

type TAvatarSize = "XS" | "SM" | "MD" | "LG";

const sizeMap: Record<TAvatarSize, string> = {
  XS: "size-6 text-[10px]",
  SM: "size-8 text-xs",
  MD: "size-10 text-sm",
  LG: "size-12 text-base",
};

export function CommonAvatar({
  name,
  size = "MD",
  className,
  fallbackClassName,
}: TCommonAvatarProps) {
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
}
