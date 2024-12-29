"use client";

import { useSidebar } from "./SidebarContext";

type SectionHeadingProps = {
  title: string;
  hasDivider?: boolean;
};

export default function SectionHeading({
  title,
  hasDivider = false,
}: SectionHeadingProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="mt-6 mb-4">
      {hasDivider && (
        <div className="h-px bg-sidebar-border/50 dark:bg-dark-sidebar-border/50 mb-4 mx-3" />
      )}
      {!isCollapsed && (
        <h2 className="px-3 text-xs font-semibold text-sidebar-text-secondary dark:text-dark-sidebar-text-secondary uppercase tracking-wider">
          {title}
        </h2>
      )}
    </div>
  );
}
