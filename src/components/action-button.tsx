import { TrashIcon, PlusIcon, PencilSimpleIcon, EyeIcon, PackageIcon } from "@phosphor-icons/react";
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

type TViewButtonProps = TButtonProps & { tooltip: string };

export function ViewButton({ tooltip, ...props }: TViewButtonProps) {
  return (
    <ToolTipContainer label={tooltip}>
      <Button variant="secondary" size="icon-lg" {...props}>
        <EyeIcon className="size-4" />
        <span className="sr-only">View details</span>
      </Button>
    </ToolTipContainer>
  );
}

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

type TDeleteButtonProps = TButtonProps & { tooltip: string };

export function DeleteButton({ tooltip, ...props }: TDeleteButtonProps) {
  return (
    <ToolTipContainer label={tooltip}>
      <Button variant="destructive" size="icon-lg" {...props}>
        <TrashIcon className="size-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </ToolTipContainer>
  );
}

type TRestockButtonProps = TButtonProps & { tooltip: string };

export function RestockButton({ tooltip, ...props }: TRestockButtonProps) {
  return (
    <ToolTipContainer label={tooltip}>
      <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white" size="icon-lg" {...props}>
        <PackageIcon className="size-4" />
        <span className="sr-only">Restock</span>
      </Button>
    </ToolTipContainer>
  );
}
