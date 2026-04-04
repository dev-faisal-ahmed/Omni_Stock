"use client";

import { ListChecksIcon, PackageIcon, SquaresFourIcon, TagIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type TNavItem = {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  items?: TNavSubItem[];
};

type TNavSubItem = {
  title: string;
  url: string;
  isActive: boolean;
};

export function useNavItems() {
  const pathname = usePathname();

  const navItems = useMemo(() => {
    const exactMatch = (url: string) => pathname === url;
    const partialMatch = (url: string) => pathname.startsWith(url);

    return [
      {
        title: "Dashboard",
        url: "/",
        icon: SquaresFourIcon,
        isActive: exactMatch("/"),
      },
      {
        title: "Categories",
        url: "/categories",
        icon: TagIcon,
        isActive: exactMatch("/categories"),
      },
      {
        title: "Products",
        url: "/products",
        icon: PackageIcon,
        isActive: partialMatch("/products"),
        items: [
          {
            title: "All Products",
            url: "/products",
            isActive: exactMatch("/products"),
          },
          {
            title: "Re Stock Queue",
            url: "/products/re-stock",
            isActive: exactMatch("/products/re-stock"),
          },
        ],
      },
      {
        title: "Orders",
        url: "/orders",
        icon: ListChecksIcon,
        isActive: partialMatch("/order"),
        items: [
          {
            title: "Add New Order",
            url: "/orders/new",
            isActive: exactMatch("/orders/new"),
          },
          {
            title: "All Orders",
            url: "/orders",
            isActive: exactMatch("/orders"),
          },
        ],
      },
    ] as TNavItem[];
  }, [pathname]);

  return { navItems };
}
