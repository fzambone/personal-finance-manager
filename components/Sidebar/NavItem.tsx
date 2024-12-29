"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Tooltip from "../Generic/Tooltip";
import { useState } from "react";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  count?: number;
  subItems?: {
    label: string;
    href: string;
  }[];
};

export default function NavItem({
  icon,
  label,
  href = "/",
  count,
  subItems,
}: NavItemProps) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const isActive =
    pathname === href || subItems?.some((item) => pathname === item.href);
  const [isOpen, setIsOpen] = useState(false);

  const content = (
    <div className="w-full">
      <div
        className={`
          flex items-center px-3 py-2 rounded-lg
          transition-all duration-200 group cursor-pointer
          ${
            isActive
              ? "bg-sidebar-active dark:bg-dark-sidebar-active text-sidebar-text-primary dark:text-dark-sidebar-text-primary"
              : "text-sidebar-text-inactive dark:text-dark-sidebar-text-inactive hover:bg-sidebar-hover dark:hover:bg-dark-sidebar-hover hover:text-sidebar-text-primary dark:hover:text-dark-sidebar-text-primary"
          }
        `}
        onClick={() => subItems && setIsOpen(!isOpen)}
      >
        <div className="flex items-center flex-1">
          <div
            className={`
              ${
                isActive
                  ? "text-sidebar-text-primary dark:text-dark-sidebar-text-primary"
                  : "text-sidebar-text-inactive dark:text-dark-sidebar-text-inactive"
              }
              group-hover:text-sidebar-text-primary dark:group-hover:text-dark-sidebar-text-primary
              transition-colors duration-200
            `}
          >
            {icon}
          </div>

          {!isCollapsed && (
            <>
              <span className="ml-3 text-sm font-medium truncate">{label}</span>
              {subItems && (
                <ChevronDownIcon
                  className={`w-4 h-4 ml-auto transition-transform duration-200 
                    ${isOpen ? "transform rotate-180" : ""}`}
                />
              )}
            </>
          )}
        </div>

        {!isCollapsed && count && (
          <span
            className={`
              ml-auto text-xs px-2 py-0.5 rounded-full
              animate-in fade-in-0 zoom-in-95
              ${
                isActive
                  ? "bg-sidebar-text-primary dark:bg-dark-sidebar-text-primary text-sidebar-bg dark:text-dark-sidebar-bg"
                  : "bg-sidebar-hover dark:bg-dark-sidebar-hover text-sidebar-text-secondary dark:text-dark-sidebar-text-secondary"
              }
            `}
          >
            {count}
          </span>
        )}
      </div>

      {!isCollapsed && isOpen && subItems && (
        <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-left-5">
          {subItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-3 py-2 rounded-lg text-sm
                ${
                  pathname === item.href
                    ? "bg-sidebar-active dark:bg-dark-sidebar-active text-sidebar-text-primary dark:text-dark-sidebar-text-primary"
                    : "text-sidebar-text-inactive dark:text-dark-sidebar-text-inactive hover:bg-sidebar-hover dark:hover:bg-dark-sidebar-hover hover:text-sidebar-text-primary dark:hover:text-dark-sidebar-text-primary"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={label} side="right">
        <div>{content}</div>
      </Tooltip>
    );
  }

  return content;
}
