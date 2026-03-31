import { SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { AppSidebar } from "./app-sidebar";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
