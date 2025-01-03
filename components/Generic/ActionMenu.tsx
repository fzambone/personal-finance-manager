"use client";

import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

type Action = {
  label: string;
  action: () => Promise<void>;
  variant?: "danger" | "default";
};

type ActionMenuProps = {
  actions: Action[];
};

export default function GenericActionMenu({ actions }: ActionMenuProps) {
  const [position, setPosition] = useState<"up" | "down">("down");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const checkPosition = useCallback(() => {
    if (!menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setPosition(spaceBelow < 100 ? "up" : "down");
  }, []);

  useEffect(() => {
    checkPosition();

    const handleScroll = () => {
      window.requestAnimationFrame(checkPosition);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [checkPosition]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button
              ref={buttonRef}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            beforeEnter={checkPosition}
          >
            <Menu.Items
              ref={menuRef}
              className={`
                absolute z-50 w-56 rounded-md bg-white dark:bg-gray-800 
                shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none 
                divide-y divide-gray-100 dark:divide-gray-700 right-0
                ${position === "up" ? "bottom-full mb-2" : "top-full mt-2"}
              `}
            >
              <div className="py-1">
                {actions.map((action) => (
                  <Menu.Item key={action.label}>
                    {({ active }) => (
                      <button
                        onClick={action.action}
                        className={`
                          ${active ? "bg-gray-100 dark:bg-gray-700" : ""}
                          ${
                            action.variant === "danger"
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-900 dark:text-gray-300"
                          }
                          group flex w-full items-center px-4 py-2 text-sm
                        `}
                      >
                        {action.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
