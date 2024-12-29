"use client";

import { useSidebar } from "./SidebarContext";
import Image from "next/image";

export default function SidebarHero() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex items-center p-4 mb-6">
      <div className="flex items-center">
        <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 dark:from-blue-600 dark:to-cyan-500 rounded-lg shadow-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">PF</span>
        </div>
        {!isCollapsed && (
          <div className="ml-3 overflow-hidden transition-all duration-200">
            <h1 className="text-sidebar-text-primary dark:text-dark-sidebar-text-primary font-semibold text-sm whitespace-nowrap">
              Personal Finance
            </h1>
            <p className="text-sidebar-text-secondary dark:text-dark-sidebar-text-secondary text-xs">
              Manager
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
