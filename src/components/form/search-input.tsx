import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type TSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChange,
  className,
  placeholder = "Search...",
}: TSearchInputProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <MagnifyingGlassIcon className="text-muted-foreground absolute left-3 size-4 shrink-0" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
