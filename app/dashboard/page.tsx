"use client";

import Link from "next/link";

const quickActions = [
  {
    title: "Add Sale",
    description: "Create a new sales invoice.",
    href: "/dashboard/sales/addSale",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    icon: "🛒",
  },
  {
    title: "Sales History",
    description: "View all sales and invoices.",
    href: "/dashboard/sales",
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    icon: "📑",
  },
  {
    title: "Business Summary",
    description: "View yearly and all-time reports.",
    href: "/dashboard/summary",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    icon: "📊",
  },
  {
    title: "Products",
    description: "Manage products and stock.",
    href: "/dashboard/products",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    icon: "📦",
  },
  {
    title: "Add Product",
    description: "Add a new product.",
    href: "/dashboard/products/add",
    color: "bg-violet-50 border-violet-200 hover:bg-violet-100",
    icon: "➕",
  },
  {
    title: "Purchase",
    description: "Create a new purchase.",
    href: "/dashboard/purchase",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    icon: "🚚",
  },
  {
    title: "Customers",
    description: "Manage customer records.",
    href: "/dashboard/customers",
    color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
    icon: "👥",
  },
  {
    title: "Payments",
    description: "Receive customer payments.",
    href: "/dashboard/payments",
    color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
    icon: "💰",
  },
  {
    title: "Expenses",
    description: "Record business expenses.",
    href: "/dashboard/expenses",
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    icon: "💸",
  },
  {
    title: "Returns",
    description: "Manage returned products.",
    href: "/dashboard/returns",
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    icon: "↩️",
  },
  {
    title: "Fund Record",
    description: "Track cash and fund history.",
    href: "/dashboard/fund-record",
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    icon: "🏦",
  },
  {
    title: "Settings",
    description: "Manage application settings.",
    href: "/dashboard/settings",
    color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
    icon: "⚙️",
  },
];

const OverviewPage = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome back! Choose a quick action below to manage your business.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Quick Actions
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md ${item.color}`}
            >
              <div className="text-4xl">
                {item.icon}
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;