"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import { UserRole } from "@/interfaces/userInterfaces";

export default function StoreNavbar() {
  const pathname = usePathname();
  const { user } = useUser();

  const userRole = (user?.role || "USER") as UserRole;

  const menus = [
    {
      name: "🏠Quick Actions",
      href: "/dashboard",
      roles: ["admin", "staff"],
    },
    {
      name: "📊 Summary",
      href: "/dashboard/summary",
      roles: ["admin", "staff"],
    },
    {
      name: "📦 Products",
      href: "/dashboard/products",
      roles: ["admin", "staff"],
    },
    {
      name: "➕ Add Product",
      href: "/dashboard/products/add",
      roles: ["admin", "staff"],
    },
    {
      name: "🛒 Sales",
      href: "/dashboard/sales",
      roles: ["admin", "staff", "SALESMAN"],
    },
    {
      name: "🧾 Add Sale",
      href: "/dashboard/sales/addSale",
      roles: ["admin", "staff"],
    },
    {
      name: "💰 Payments",
      href: "/dashboard/payments",
      roles: ["admin", "staff"],
    },
    {
      name: "💸 Expenses",
      href: "/dashboard/expenses",
      roles: ["admin", "staff"],
    },
    {
      name: "👥 Customers",
      href: "/dashboard/customers",
      roles: ["admin", "staff", "SALESMAN"],
    },
    {
      name: "🗂 Categories",
      href: "/dashboard/categories",
      roles: ["admin", "staff"],
    },
    {
      name: "🚚 Purchase",
      href: "/dashboard/purchase",
      roles: ["admin", "staff"],
    },
    {
      name: "🏦 Fund Record",
      href: "/dashboard/fund-record",
      roles: ["admin", "staff"],
    },
    {
      name: "↩️ Returns",
      href: "/dashboard/returns",
      roles: ["admin", "staff"],
    },
    {
      name: "⚙️ Settings",
      href: "/dashboard/settings",
      roles: ["admin"],
    },
  ];

  const filteredMenus = menus.filter((menu) =>
    menu.roles.includes(userRole)
  );

  return (
    <nav className="space-y-1">
      {filteredMenus.map((menu) => {
        const isActive =
          pathname === menu.href ||
          (menu.href !== "/dashboard" &&
            pathname.startsWith(menu.href));

        return (
          <Link
            key={menu.href}
            href={menu.href}
            className={`group relative flex items-center rounded-xl px-4 py-3 font-bold font-medium transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
            )}

            <span className="ml-2 flex-1">{menu.name}</span>

            {!isActive && (
              <span className="opacity-0 transition-all duration-200 group-hover:opacity-100">
                →
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}