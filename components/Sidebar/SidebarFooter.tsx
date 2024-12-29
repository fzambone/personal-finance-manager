"use client";

import { useSidebar } from "./SidebarContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import Tooltip from "../Generic/Tooltip";
import { useTheme } from "next-themes";

export default function SidebarFooter() {
  const { isCollapsed } = useSidebar();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const content = (
    <div
      className={`
        flex items-center px-3 py-2 mx-3 rounded-lg cursor-pointer
        text-sidebar-text-inactive dark:text-dark-sidebar-text-inactive 
        hover:bg-sidebar-hover dark:hover:bg-dark-sidebar-hover 
        hover:text-sidebar-text-primary dark:hover:text-dark-sidebar-text-primary
        transition-all duration-200
      `}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </div>
  );

  return (
    <div className="mt-auto mb-4">
      <div className="h-px bg-sidebar-border/50 dark:bg-dark-sidebar-border/50 mb-4 mx-3" />
      {isCollapsed ? (
        <Tooltip
          content={theme === "dark" ? "Light Mode" : "Dark Mode"}
          side="right"
        >
          <div>{content}</div>
        </Tooltip>
      ) : (
        content
      )}
    </div>
  );
}
