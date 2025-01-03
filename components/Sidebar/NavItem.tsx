"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Tooltip from "../Generic/Tooltip";
import { motion } from "framer-motion";

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

  const content = (
    <Link
      href={href}
      className={`
        group flex items-center gap-x-3 p-2 rounded-lg
        transition-all duration-200 ease-in-out
        ${
          isActive
            ? "nav-item-active bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
            : "nav-item text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white"
        }
      `}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1.1 : 1,
          rotate: isActive ? 360 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={`
          flex-shrink-0 w-6 h-6
          ${
            isActive
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
          }
        `}
      >
        {icon}
      </motion.div>

      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {count !== undefined && (
            <span
              className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  isActive
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }
              `}
            >
              {count}
            </span>
          )}
        </>
      )}
    </Link>
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
