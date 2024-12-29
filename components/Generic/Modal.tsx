"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  description?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md rounded-lg p-6 bg-white shadow-xl animate-slide-up">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
