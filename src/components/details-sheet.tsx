"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { ViewButton } from "./action-button";

type TDetailsSheetProps = {
  title: string;
  tooltip?: string;
  children: React.ReactNode;
};

export function DetailsSheet({ title, tooltip = "View details", children }: TDetailsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <ViewButton tooltip={tooltip} />
      </SheetTrigger>
      <SheetContent className="flex h-dvh flex-col p-0 data-[side=left]:sm:max-w-150 data-[side=right]:sm:max-w-150">
        <SheetHeader className="px-6 pt-6 pb-6">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">Details Sheet</SheetDescription>
        </SheetHeader>
        <ScrollArea className="grow">
          <section className="px-6 pb-6">{children}</section>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
