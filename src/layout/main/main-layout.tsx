import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopBar } from "./app-top-bar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-[calc(100dvh-1rem)] border">
        <AppTopBar />
        <ScrollArea fixedLayout className="grow">
          <section className="p-4">{children}</section>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
