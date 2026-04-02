"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type TFormSheetProps = {
  formId: string;
  title: string;
  children: React.ReactNode;
  submitButtonTitle?: string;
  submitLoadingTitle?: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  isLoading?: boolean;
  preventClose?: boolean;
};

export function FormSheet({
  formId,
  open,
  onOpenChange,
  title,
  isLoading,
  children,
  preventClose,
}: TFormSheetProps) {
  const handlePreventClose = (e: { preventDefault: () => void }) => {
    if (preventClose) e.preventDefault();
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex h-dvh flex-col p-0 data-[side=right]:sm:max-w-150 data-[side=left]:sm:max-w-150"
        onInteractOutside={handlePreventClose}
        onEscapeKeyDown={handlePreventClose}
      >
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">Sheet</SheetDescription>
        </SheetHeader>
        <ScrollArea className="grow">
          <section className="px-6">{children}</section>
        </ScrollArea>
        <SheetFooter className="flex-row items-center gap-4 px-6 pb-6">
          <SheetClose asChild>
            <Button className="flex-1" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button form={formId} type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
