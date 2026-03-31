"use client";

import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useNavItems } from "./use-nav-items";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AppLogo } from "@/components/app-logo";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <AppSidebarHeader />

      <SidebarContent className="mt-2">
        <SidebarGroup>
          <AppSidebarNavItems />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <AppLogo />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function AppSidebarNavItems() {
  const { navItems } = useNavItems();

  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {navItems.map((item, index) => (
          <SidebarLink key={index} {...item} />
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}

type TSidebarItem = ReturnType<typeof useNavItems>["navItems"][number];

function SidebarLink({ url, icon: Icon, title, items, isActive }: TSidebarItem) {
  if (!items?.length)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive}>
          <Link className="text-muted-foreground" href={url ?? ""}>
            <Icon />
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );

  if (items)
    return (
      <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              className={cn(!isActive && "text-muted-foreground")}
              tooltip={title}
            >
              <Icon />
              <span>{title}</span>
              <CaretRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub className="pt-2">
              {items.map(({ title, url, isActive }) => (
                <SidebarMenuSubItem key={url} className="w-full">
                  <SidebarMenuSubButton asChild isActive={isActive}>
                    <Link className="text-muted-foreground" href={url}>
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
}
