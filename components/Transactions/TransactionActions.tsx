"use client";

import { deleteTransaction } from "@/app/actions/transactions";
import { useState } from "react";
import ConfirmationDialog from "../Generic/ConfirmationDialog";
import Modal from "../Generic/Modal";
import TransactionForm from "./TransactionForm";
import { Transaction } from "@/app/types/transaction";
import GenericActionMenu from "@/components/Generic/ActionMenu";
import { toast } from "react-hot-toast";

type FormOptions = {
  types: { label: string; value: string }[];
  categories: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
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

  const handleDelete = async () => {
    try {
      // Optimistically remove from UI
      onOptimisticDelete(id);
      // Close the dialog
      setShowDeleteDialog(false);
      // Then perform the actual delete
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      // Show error and reload data if delete fails
      toast.error("Failed to delete transaction. Please try again.");
      window.location.reload();
    }
  };

  return (
    <>
      <GenericActionMenu
        actions={[
          {
            label: "Edit",
            action: async () => setShowEditModal(true),
          },
          {
            label: "Delete",
            action: async () => setShowDeleteDialog(true),
            variant: "danger",
          },
        ]}
      />

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
        onClose={() => setShowEditModal(false)}
        title="Edit Transaction"
      >
        <TransactionForm
          transaction={data}
          formOptions={formOptions}
          onClose={() => setShowEditModal(false)}
          onOptimisticUpdate={onOptimisticUpdate}
        />
      </Modal>
    </>
  );
}
