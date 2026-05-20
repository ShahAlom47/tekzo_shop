"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/Interfaces/userInterfaces";
import { useUser } from "@/context/AuthContext";

export default function StoreNavbar() {
  const pathname = usePathname();
  const {user}= useUser();
  

  // 🔥 example (replace with real auth)
  const userRole=user?.role || "USER" as UserRole;

  const menus = [
    {
      name: "Overview",
      href: "/dashboard",
      roles: ["admin", "staff"],
    },
    {
      name: "Products",
      href: "/dashboard/products",
      roles: ["admin", "staff"],  
    },
    {
      name: "Add Product",
      href: "/dashboard/products/add",
      roles: ["admin  ", "staff"],
    },
    {
      name: "Sales",
      href: "/dashboard/sales",
      roles: ["admin", "staff", "SALESMAN"],
    },
    {
      name: "Add Sale",
      href: "/dashboard/sales/addSale",
      roles: ["admin", "staff"],
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      roles: ["admin", "staff"],
    },
    {
      name: "Expenses",
      href: "/dashboard/expenses",
      roles: ["admin", "staff"],
    },
    {
      name: "Customers",
      href: "/dashboard/customers",
      roles: ["admin", "staff", "SALESMAN"],
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      roles: ["admin", "staff"],
    },
    {
      name: "Purchase",
      href: "/dashboard/purchase",
      roles: ["admin", "staff"],
    },
    {
      name: "Fund Record",
      href: "/dashboard/fund-record",
      roles: ["admin"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      roles: ["admin"],
    },
  ];

  const filteredMenus = menus.filter((menu) =>
    menu.roles.includes(userRole)
  );

  return (
    <nav className="px-3 py-4 flex flex-col gap-1">
      {filteredMenus.map((menu) => {
        const isActive = pathname === menu.href;

        return (
          <Link
            key={menu.href}
            href={menu.href}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {menu.name}

            {isActive && (
              <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}