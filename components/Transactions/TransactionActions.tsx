"use client";

import { deleteTransaction } from "@/app/actions/transactions";
import { useState } from "react";
import ConfirmationDialog from "../Generic/ConfirmationDialog";
import Modal from "../Generic/Modal";
import TransactionForm from "./TransactionForm";
import { Transaction } from "@/app/types/transaction";
import GenericActionMenu from "@/components/Generic/ActionMenu";

type TransactionActionsProps = {
  id: string;
  data: Transaction;
};

export default function TransactionActions({
  id,
  data,
}: TransactionActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    await deleteTransaction(id);
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
          onClose={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
}
