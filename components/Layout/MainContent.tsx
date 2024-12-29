"use client";

import { useSidebar } from "@/components/Sidebar/SidebarContext";
import Header from "@/components/Header";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`flex-1 transition-all duration-200 ease-out ${
        isCollapsed ? "pl-16" : "pl-64"
      }`}
    >
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
}
