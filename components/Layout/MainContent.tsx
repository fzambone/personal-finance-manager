"use client";

import { useSidebar } from "@/components/Sidebar/SidebarContext";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

const pageTitle: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/analytics": "Analytics",
  "/users": "Users",
  "/settings": "Settings",
};

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const title = pageTitle[pathname] || "Dashboard";

  return (
    <div
      className={`
        flex-1
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}
      `}
    >
      <Header title={title} />
      <main className="p-4">{children}</main>
    </div>
  );
}
