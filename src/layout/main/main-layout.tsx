import { SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";

export function MainLayout({ children }: PropsWithChildren) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
