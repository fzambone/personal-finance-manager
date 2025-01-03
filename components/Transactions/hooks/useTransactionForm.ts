import { Transaction } from "@/app/types/transaction";
import { updateTransaction } from "@/app/actions/transactions";
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { FormOptions } from "./useTransactionList";

export type TransactionFormData = {
  name: string;
  amount: string;
  date: string;
  type_id: string;
  category_id: string;
  payment_method_id: string;
};

function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters and convert to cents
  const numericValue = value.replace(/\D/g, "");
  return parseInt(numericValue, 10) || 0;
}

export function useTransactionForm(
  transaction: Transaction,
  formOptions: FormOptions | null,
  onClose: () => void,
  onOptimisticUpdate: (id: string, updatedData: Partial<Transaction>) => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (data: TransactionFormData) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        const amountInCents = parseCurrencyInput(data.amount);
        if (isNaN(amountInCents)) {
          throw new Error("Invalid amount format");
        }

        if (!formOptions) {
          throw new Error("Form options not loaded");
        }

        // Get the selected type's label
        const selectedType = formOptions.types
          .find((t) => t.value === data.type_id)
          ?.label.toUpperCase();

        if (!selectedType) {
          throw new Error("Invalid transaction type");
        }

        // Prepare the updated transaction data
        const updatedData: Partial<Transaction> = {
          name: data.name,
          amount: amountInCents,
          date: data.date,
          type_id: data.type_id,
          category_id: data.category_id,
          payment_method_id: data.payment_method_id,
          type: selectedType as Transaction["type"],
          category:
            formOptions.categories.find((c) => c.value === data.category_id)
              ?.label || transaction.category,
          paymentMethod:
            formOptions.paymentMethods.find(
              (p) => p.value === data.payment_method_id
            )?.label || transaction.paymentMethod,
        };

        // Update UI optimistically and close modal immediately
        onOptimisticUpdate(transaction.id, updatedData);
        onClose();

        // Show loading toast
        const toastId = toast.loading("Saving changes...");

        // Perform the actual update in the background
        await updateTransaction(transaction.id, {
          ...data,
          amount: amountInCents,
        });

        // Show success message
        toast.success("Transaction updated successfully", { id: toastId });
      } catch (error) {
        console.error("Failed to update transaction:", error);
        // Show error message
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update transaction. Changes will be reverted."
        );
        // Trigger a revalidation to revert the optimistic update
        onOptimisticUpdate(transaction.id, transaction);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, transaction, formOptions, onClose, onOptimisticUpdate]
  );

  return {
    isSubmitting,
    handleSubmit,
  };
}
