"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useModal } from "./ModalContext";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  const { setIsModalOpen } = useModal();

  useEffect(() => {
    setIsModalOpen(isOpen);
    return () => {
      setIsModalOpen(false);
    };
  }, [isOpen, setIsModalOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm animate-fade-in z-40" />
        <Dialog.Content
          className={`
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-[95vw] ${sizeClasses[size]}
            rounded-xl p-8
            bg-white dark:bg-gray-900
            shadow-xl dark:shadow-2xl-dark
            animate-slide-up
            border border-gray-200 dark:border-gray-800
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-50
            z-50
          `}
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-full p-1"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {description}
            </Dialog.Description>
          )}

          <div className="relative">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
