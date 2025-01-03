import { Transaction } from "@/app/types/transaction";
import {
  updateTransaction,
  createTransaction,
} from "@/app/actions/transactions";
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
  onOptimisticUpdate: (
    id: string,
    updatedData: Partial<Transaction> | undefined
  ) => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNewTransaction = !transaction.id;

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

        // Get category and payment method labels
        const category =
          formOptions.categories.find((c) => c.value === data.category_id)
            ?.label || "";
        const paymentMethod =
          formOptions.paymentMethods.find(
            (p) => p.value === data.payment_method_id
          )?.label || "";

        if (isNewTransaction) {
          // Create optimistic transaction data
          const optimisticTransaction: Transaction = {
            id: crypto.randomUUID(),
            name: data.name,
            amount: amountInCents,
            date: data.date,
            type_id: data.type_id,
            category_id: data.category_id,
            payment_method_id: data.payment_method_id,
            type: selectedType,
            category,
            paymentMethod,
            user_id: "d95ba6de-fce1-4fe9-92d7-88558dafce0a",
            user: "Bob Johnson",
            status_id: "0167ddcc-3089-485b-9ce3-256f17ebdf64",
            status: "approved",
          };

          // Close modal and update UI immediately
          onClose();
          onOptimisticUpdate(optimisticTransaction.id, optimisticTransaction);

          try {
            // Create the transaction in the background
            const serverData = {
              name: data.name,
              amount: amountInCents,
              date: data.date,
              type_id: data.type_id,
              category_id: data.category_id,
              payment_method_id: data.payment_method_id,
            };

            const createdTransaction = await createTransaction(serverData);

            // Replace the optimistic transaction with the real one
            onOptimisticUpdate(optimisticTransaction.id, undefined);
            onOptimisticUpdate(createdTransaction.id, createdTransaction);
            toast.success("Transaction created successfully");
          } catch (error) {
            console.error("Failed to create transaction:", error);
            onOptimisticUpdate(optimisticTransaction.id, undefined);
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to create transaction. Please try again."
            );
          }
        } else {
          // Prepare update data
          const updateData = {
            name: data.name,
            amount: amountInCents,
            date: data.date,
            type_id: data.type_id,
            category_id: data.category_id,
            payment_method_id: data.payment_method_id,
            type: selectedType,
            category,
            paymentMethod,
          };

          // Update UI optimistically
          onOptimisticUpdate(transaction.id, updateData);
          onClose();

          try {
            // Perform the actual update
            await updateTransaction(transaction.id, {
              ...data,
              amount: amountInCents,
            });
            toast.success("Transaction updated successfully");
          } catch (error) {
            console.error("Failed to update transaction:", error);
            onOptimisticUpdate(transaction.id, transaction);
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to update transaction. Please try again."
            );
          }
        }
      } catch (error) {
        console.error(
          `Failed to ${isNewTransaction ? "create" : "update"} transaction:`,
          error
        );
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to ${
                isNewTransaction ? "create" : "update"
              } transaction. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      transaction,
      formOptions,
      onClose,
      onOptimisticUpdate,
      isNewTransaction,
    ]
  );

  return {
    isSubmitting,
    handleSubmit,
  };
}
