"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useSidebar } from "./SidebarContext";
import { useModal } from "../Generic/ModalContext";

type SidebarContainerProps = {
  children: React.ReactNode;
};

export default function SidebarContainer({ children }: SidebarContainerProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { isModalOpen } = useModal();

  return (
    <>
      {/* Mobile backdrop */}
      <div className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden" />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isCollapsed ? "w-20" : "w-72"}
          ${
            isModalOpen
              ? "backdrop-blur-md bg-white/80 dark:bg-gray-900/80"
              : ""
          }
        `}
      >
        <div
          className={`
            flex-1 flex flex-col min-h-0 
            bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/95
            transition-colors duration-300
            ${
              isModalOpen
                ? "from-gray-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-900/75"
                : ""
            }
          `}
        >
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1">{children}</div>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute top-5 -right-4
            w-8 h-8
            flex items-center justify-center
            rounded-full
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            text-gray-500 dark:text-gray-400
            hover:text-gray-600 dark:hover:text-gray-300
            focus:outline-none focus:ring-2 focus:ring-primary
            transition-all duration-300
            ${isCollapsed ? "rotate-180" : ""}
            ${
              isModalOpen
                ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md"
                : ""
            }
          `}
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
      </aside>
    </>
  );
}
