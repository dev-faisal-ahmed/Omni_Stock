"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/feat/auth/auth-hook";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommonAvatar } from "@/components/common-avatar";
import { usePopupState } from "@/hooks/use-popup-state";
import { LockIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Logout } from "@/feat/auth/components/logout";

export function AppTopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="bg-border h-4 w-px" />
        <span className="text-sm font-semibold">Dashboard</span>
      </div>

      <ActionMenu />
    </header>
  );
}

function ActionMenu() {
  const { data: apiResponse } = useAuth();
  const { open, onOpenChange } = usePopupState();
  const user = apiResponse?.data;
  if (!user) return null;

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2">
          <CommonAvatar
            name={user.name ?? ""}
            fallbackClassName="bg-primary text-white"
            size="SM"
          />

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">{user.email}</span>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 p-2" align="end">
        <Button variant="ghost" className="w-full cursor-pointer justify-start px-4 py-2">
          <LockIcon /> Change Password
        </Button>
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
