import { TrashIcon, PlusIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Button, type TButtonProps } from "./ui/button";
import { ToolTipContainer } from "./tooltip-container";

export function AddButton(props: TButtonProps) {
  return (
    <Button {...props}>
      <PlusIcon className="size-4" />
      Add New
    </Button>
  );
}

// export function ViewButton(props: TButtonProps) {
//   return (
//     <Button variant="secondary" size="icon-lg" {...props}>
//       <EyeIcon className="size-4" />
//       <span className="sr-only">View details</span>
//     </Button>
//   );
// }

type TUpdateButtonProps = TButtonProps & { tooltip: string };

export function UpdateButton({ tooltip, ...props }: TUpdateButtonProps) {
  return (
    <ToolTipContainer label={tooltip}>
      <Button variant="outline" size="icon-lg" {...props}>
        <PencilSimpleIcon className="size-4" />
        <span className="sr-only">Edit category</span>
      </Button>
    </ToolTipContainer>
  );
}

export function DeleteButton(props: TButtonProps) {
  return (
    <Button variant="destructive" size="icon-lg" {...props}>
      <TrashIcon className="size-4" />
      <span className="sr-only">Delete</span>
    </Button>
  );
}
