import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "@phosphor-icons/react";

type TSelectOption = {
  label: string;
  value: string;
};

type TSelectInputProps = {
  value: string | undefined;
  onChange: (value: string) => void;
  options: TSelectOption[];
  placeholder?: string;
  isLoading?: boolean;
  clearable?: boolean;
};

export function SelectInput({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  isLoading = false,
  clearable = false,
}: TSelectInputProps) {
  const isDisabled = isLoading || options.length === 0;

  const getPlaceholder = () => {
    if (isLoading) return "Loading...";
    if (options.length === 0) return "No options available";
    return placeholder;
  };

  return (
    <Select value={value} onValueChange={onChange} disabled={isDisabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={getPlaceholder()} />
        {clearable && value && (
          <span
            role="button"
            aria-label="Clear selection"
            className="text-muted-foreground hover:text-foreground ml-auto shrink-0 cursor-pointer transition-colors"
            onPointerDown={(e) => {
              e.stopPropagation();
              onChange("");
            }}
          >
            <XIcon className="size-3.5" />
          </span>
        )}
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
