import { TrashIcon, PlusIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Button, type TButtonProps } from "./ui/button";

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

export function UpdateButton(props: TButtonProps) {
  return (
    <Button variant="outline" size="icon-lg" {...props}>
      <PencilSimpleIcon className="size-4" />
      <span className="sr-only">Edit category</span>
    </Button>
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
