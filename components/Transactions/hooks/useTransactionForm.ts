import { Transaction } from "@/app/types/transaction";
import {
  updateTransaction,
  createTransaction,
} from "@/app/actions/transactions";
import { useState, useCallback } from "react";
import { FormOptions } from "./useTransactionList";
import { notificationService } from "@/app/services/ui/notifications";

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

      try {
        setIsSubmitting(true);
        const loadingToastId = notificationService.loading(
          isNewTransaction
            ? "Creating transaction..."
            : "Updating transaction..."
        );

        const amountInCents = parseCurrencyInput(data.amount);
        if (isNaN(amountInCents)) {
          notificationService.dismiss(loadingToastId);
          notificationService.error("Invalid amount format");
          return;
        }

        if (!formOptions) {
          notificationService.dismiss(loadingToastId);
          notificationService.error("Form options not loaded");
          return;
        }

        // Get the selected type's label
        const selectedType = formOptions.types
          .find((t) => t.value === data.type_id)
          ?.label.toUpperCase();

        if (!selectedType) {
          notificationService.dismiss(loadingToastId);
          notificationService.error("Invalid transaction type");
          return;
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
          // Create optimistic transaction data with a temporary ID
          const optimisticId = crypto.randomUUID();
          const optimisticTransaction: Transaction = {
            id: optimisticId,
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

          // Close modal and update UI immediately with optimistic data
          onClose();
          onOptimisticUpdate(optimisticId, optimisticTransaction);

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

            // Remove the optimistic transaction and add the real one
            onOptimisticUpdate(optimisticId, undefined);
            onOptimisticUpdate(createdTransaction.id, createdTransaction);

            notificationService.dismiss(loadingToastId);
            notificationService.success("Transaction created successfully");
          } catch (error) {
            notificationService.dismiss(loadingToastId);
            // Revert optimistic update
            onOptimisticUpdate(optimisticId, undefined);

            if (error instanceof Error) {
              notificationService.error(error.message);
            } else {
              notificationService.error(
                "Failed to create transaction. Please try again."
              );
            }
          }
        } else {
          // Update existing transaction
          const updatedData = {
            name: data.name,
            amount: amountInCents,
            date: data.date,
            type_id: data.type_id,
            category_id: data.category_id,
            payment_method_id: data.payment_method_id,
          };

          // Close modal and update UI immediately
          onClose();
          const optimisticData = {
            ...updatedData,
            type: selectedType,
            category,
            paymentMethod,
          };
          onOptimisticUpdate(transaction.id, optimisticData);

          try {
            await updateTransaction(transaction.id, updatedData);
            notificationService.dismiss(loadingToastId);
            notificationService.success("Transaction updated successfully");
          } catch (error) {
            notificationService.dismiss(loadingToastId);
            // Revert optimistic update
            onOptimisticUpdate(transaction.id, transaction);

            if (error instanceof Error) {
              if (error.message.includes("Transaction not found")) {
                notificationService.error(
                  "Transaction not found. It may have been deleted."
                );
              } else {
                notificationService.error(
                  error.message ||
                    "Failed to update transaction. Please try again."
                );
              }
            } else {
              notificationService.error(
                "Failed to update transaction. Please try again."
              );
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          notificationService.error(error.message);
        } else {
          notificationService.error("An unexpected error occurred");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      isNewTransaction,
      transaction,
      formOptions,
      onClose,
      onOptimisticUpdate,
    ]
  );

  return {
    handleSubmit,
    isSubmitting,
  };
}
