"use client";

import { deleteTransaction } from "@/app/actions/transactions";
import { useState, useCallback } from "react";
import ConfirmationDialog from "../Generic/ConfirmationDialog";
import Modal from "../Generic/Modal";
import TransactionForm from "./TransactionForm";
import { Transaction } from "@/app/types/transaction";
import GenericActionMenu from "@/components/Generic/ActionMenu";
import { notificationService } from "@/app/services/ui/notifications";

type FormOptions = {
  types: { label: string; value: string }[];
  categories: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
};

type Action = {
  label: string;
  action: () => Promise<void>;
  variant?: "danger" | "default";
};

type TransactionActionsProps = {
  id: string;
  data: Transaction;
  formOptions: FormOptions | null;
  onOptimisticUpdate: (
    id: string,
    updatedData: Partial<Transaction> | undefined
  ) => void;
  onOptimisticDelete: (id: string) => void;
};

export default function TransactionActions({
  id,
  data,
  formOptions,
  onOptimisticUpdate,
  onOptimisticDelete,
}: TransactionActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const loadingToastId = notificationService.loading(
        "Deleting transaction..."
      );

      // Optimistically remove from UI
      onOptimisticDelete(id);
      // Close the dialog
      setShowDeleteDialog(false);

      try {
        // Then perform the actual delete
        await deleteTransaction(id);
        notificationService.dismiss(loadingToastId);
        notificationService.success("Transaction deleted successfully");
      } catch (error) {
        notificationService.dismiss(loadingToastId);
        // Revert optimistic update since the deletion failed
        onOptimisticUpdate(id, data);

        if (error instanceof Error) {
          if (error.message.includes("Record to update not found")) {
            notificationService.error(
              "Transaction not found. It may have been deleted."
            );
          } else {
            notificationService.error(
              error.message || "Failed to delete transaction. Please try again."
            );
          }
        } else {
          notificationService.error(
            "Failed to delete transaction. Please try again."
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        notificationService.error(error.message);
      } else {
        notificationService.error("An unexpected error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  }, [id, data, onOptimisticDelete, onOptimisticUpdate, isDeleting]);

  const handleEdit = useCallback(async () => {
    setShowEditModal(true);
  }, []);

  const handleCloseEdit = useCallback(async () => {
    setShowEditModal(false);
  }, []);

  const actions: Action[] = [
    {
      label: "Edit",
      action: handleEdit,
    },
    ...(isDeleting
      ? []
      : [
          {
            label: "Delete",
            action: async () => setShowDeleteDialog(true),
            variant: "danger" as const,
          },
        ]),
  ];

  return (
    <>
      <GenericActionMenu actions={actions} />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        title="Edit Transaction"
        description={`Edit details for transaction "${data.name}"`}
        size="2xl"
      >
        <TransactionForm
          transaction={data}
          formOptions={formOptions}
          onClose={handleCloseEdit}
          onOptimisticUpdate={onOptimisticUpdate}
        />
      </Modal>
    </>
  );
}
