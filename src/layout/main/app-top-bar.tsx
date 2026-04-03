"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/feat/auth/auth-hook";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommonAvatar } from "@/components/common-avatar";
import { usePopupState } from "@/hooks/use-popup-state";
import { LockIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Logout } from "@/feat/auth/components/logout";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

export function AppTopBar() {
  const pathname = usePathname();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="bg-border h-4 w-px" />
        <span className="text-sm font-semibold">{getPageName(pathname)}</span>
      </div>

      <div className="ml-auto" />
      <ThemeSwitcher />
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
        <div className="cursor-pointer">
          <CommonAvatar
            name={user.name ?? ""}
            fallbackClassName="bg-primary text-white"
            size="SM"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-fit p-2" align="end" side="bottom" sideOffset={4}>
        <div className="grid w-fit gap-1 px-2 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{user.name}</span>
          <span className="text-muted-foreground truncate text-xs">{user.email}</span>
        </div>
        <Separator className="my-2" />
        <Button variant="ghost" className="w-full cursor-pointer justify-start px-4 py-2">
          <LockIcon /> Change Password
        </Button>
        <Logout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getPageName(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/categories")) return "Categories";
  if (pathname.startsWith("/products")) return "Products";
  return null;
}

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
