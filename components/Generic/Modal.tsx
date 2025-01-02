"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  description?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          className={`
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-[95vw] ${sizeClasses[size]}
            rounded-xl p-6 
            bg-white dark:bg-gray-800
            shadow-xl dark:shadow-2xl-dark
            animate-slide-up
            border border-gray-200 dark:border-gray-700
            focus:outline-none
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <XMarkIcon className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {description}
            </Dialog.Description>
          )}

          <div className="relative">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
