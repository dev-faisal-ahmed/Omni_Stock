"use client";

import { usePathname } from "next/navigation";
import {
  ChartLineIcon,
  ListChecksIcon,
  PackageIcon,
  SquaresFourIcon,
  TagIcon,
} from "@phosphor-icons/react";
import React from "react";

type TNavSubItem = {
  title: string;
  url: string;
  isActive: boolean;
};

type TNavItem = {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  items?: TNavSubItem[];
};

const ROUTES = [
  { title: "Dashboard", url: "/", icon: SquaresFourIcon },
  { title: "Products", url: "/products", icon: PackageIcon },
  { title: "Categories", url: "/categories", icon: TagIcon },
  { title: "Orders", url: "/orders", icon: ListChecksIcon },
  { title: "Analytics", url: "/analytics", icon: ChartLineIcon },
] as const;

export const useNavItems = () => {
  const pathname = usePathname();

  const navItems: TNavItem[] = ROUTES.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));

  return { navItems };
};
