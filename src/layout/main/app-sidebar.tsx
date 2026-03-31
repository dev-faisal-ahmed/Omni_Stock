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
    <Sidebar variant="inset" className="border-r">
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

// function AppSidebarFooter() {
//   const { data: authData } = useAuth();
//   if (!authData?.data) return null;

//   const user = authData.data;

//   return (
//     <SidebarFooter>
//       <SidebarMenu>
//         <SidebarMenuItem>
//           <div className="flex h-16 items-center justify-center gap-2 rounded-none border-t py-4 hover:bg-transparent">
//             <CommonAvatar
//               name={user.name ?? ""}
//               fallbackClassName="bg-primary text-white"
//               size="SM"
//             />

//             <div className="grid flex-1 text-left text-sm leading-tight">
//               <span className="truncate font-semibold">{user.name}</span>
//               <span className="text-muted-foreground truncate text-xs">{user.email}</span>
//             </div>
//             <ActionMenu />
//           </div>
//         </SidebarMenuItem>
//       </SidebarMenu>
//     </SidebarFooter>
//   );
// }

// function ActionMenu() {
//   const { open, onOpenChange } = usePopupState();

//   return (
//     <DropdownMenu open={open} onOpenChange={onOpenChange} modal>
//       <DropdownMenuTrigger asChild>
//         <button
//           className="hover:bg-background cursor-pointer rounded-md p-2"
//           onClick={() => onOpenChange(true)}
//         >
//           <DotsThreeIcon className="size-4" />
//         </button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent className="w-48 p-2">
//         <Button variant="ghost" className="w-full cursor-pointer justify-start px-4 py-2">
//           <LockIcon /> Change Password
//         </Button>
//         <Logout />
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };
