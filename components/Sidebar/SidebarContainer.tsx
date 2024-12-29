"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSidebar } from "./SidebarContext";
import SidebarFooter from "./SidebarFooter";

type SidebarContainerProps = {
  children: React.ReactNode;
};

export default function SidebarContainer({ children }: SidebarContainerProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`
        fixed left-0 h-screen
        bg-gradient-to-b from-sidebar-bg to-sidebar-bg/95
        dark:bg-gradient-to-b dark:from-dark-sidebar-bg dark:to-dark-sidebar-bg/95
        border-r border-sidebar-border/50
        dark:border-dark-sidebar-border/50
        transition-all duration-200 ease-out
        flex flex-col
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      <div className="flex-1 overflow-y-auto">{children}</div>
      <SidebarFooter />
      <button
        onClick={toggleSidebar}
        className="absolute right-0 top-6 -mr-4 bg-sidebar-bg rounded-full p-1.5 
          border border-sidebar-border/50 cursor-pointer hover:bg-sidebar-hover
          transition-colors duration-200"
      >
        {isCollapsed ? (
          <Bars3Icon className="h-4 w-4 text-sidebar-text-secondary" />
        ) : (
          <XMarkIcon className="h-4 w-4 text-sidebar-text-secondary" />
        )}
      </button>
    </aside>
  );
}
