"use client";

import { deleteTransaction } from "@/app/actions/transactions";
import { useState, useCallback } from "react";
import ConfirmationDialog from "../Generic/ConfirmationDialog";
import Modal from "../Generic/Modal";
import TransactionForm from "./TransactionForm";
import { Transaction } from "@/app/types/transaction";
import GenericActionMenu from "@/components/Generic/ActionMenu";
import { toast } from "react-hot-toast";
import { TransactionError } from "@/services/domain/transactions";

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
  onOptimisticUpdate: (id: string, updatedData: Partial<Transaction>) => void;
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
    try {
      setIsDeleting(true);
      // Optimistically remove from UI
      onOptimisticDelete(id);
      // Close the dialog
      setShowDeleteDialog(false);
      // Then perform the actual delete
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      if (error instanceof TransactionError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete transaction. Please try again.");
      }
      // Reload the page only if it's a critical error
      if (!(error instanceof TransactionError)) {
        window.location.reload();
      }
    } finally {
      setIsDeleting(false);
    }
  }, [id, onOptimisticDelete]);

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
