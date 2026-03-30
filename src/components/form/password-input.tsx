import { Input } from "@/components/ui/input";
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react";
import { useState, type ComponentProps } from "react";

type TPasswordInputProps = ComponentProps<"input">;

export function PasswordInput(props: TPasswordInputProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={showPass ? "text" : "password"} />
      <button
        type="button"
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPass((prev) => !prev)}
      >
        {showPass ? <EyeClosedIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
}
