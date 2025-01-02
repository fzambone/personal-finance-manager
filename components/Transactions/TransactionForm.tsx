"use client";

import { Transaction } from "@/app/types/transaction";
import { getTransactionFormOptions } from "@/services/transactions";
import { updateTransaction } from "@/app/actions/transactions";
import { formatCurrency } from "@/utils/formatCurrency";
import Form, { Field } from "../Generic/Form";
import FormSkeleton from "../Skeletons/FormSkeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type FormOptions = {
  types: { label: string; value: string }[];
  categories: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
};

type TransactionFormProps = {
  transaction: Transaction;
  formOptions: FormOptions | null;
  onClose: () => void;
  onOptimisticUpdate: (id: string, updatedData: Partial<Transaction>) => void;
};

function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, "");
  // Convert string to number
  return parseInt(numericValue, 10) || 0;
}

export default function TransactionForm({
  transaction,
  formOptions,
  onClose,
  onOptimisticUpdate,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If we have form options, we're ready to show the form
    if (formOptions) {
      setIsLoading(false);
    }
  }, [formOptions]);

  if (isLoading || !formOptions) {
    return <FormSkeleton />;
  }

  const fields: Field[] = [
    {
      name: "name",
      label: "Description",
      type: "text",
      value: transaction.name,
      required: true,
    },
    {
      name: "amount",
      label: "Amount",
      type: "text",
      value: formatCurrency(transaction.amount),
      required: true,
      placeholder: "R$ 0,00",
      inputMode: "numeric",
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      value: transaction.date,
      required: true,
    },
    {
      name: "type_id",
      label: "Type",
      type: "select",
      value: transaction.type_id,
      options: formOptions.types,
      required: true,
    },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      value: transaction.category_id,
      options: formOptions.categories,
      required: true,
    },
    {
      name: "payment_method_id",
      label: "Payment Method",
      type: "select",
      value: transaction.payment_method_id,
      options: formOptions.paymentMethods,
      required: true,
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    const toastId = toast.loading("Updating transaction...");
    try {
      const amountInCents = parseCurrencyInput(data.amount);
      if (isNaN(amountInCents)) {
        throw new Error("Invalid amount format");
      }

      // Prepare the updated transaction data
      const updatedData: Partial<Transaction> = {
        name: data.name,
        amount: amountInCents,
        date: data.date,
        type_id: data.type_id,
        category_id: data.category_id,
        payment_method_id: data.payment_method_id,
        // Map the updated type and category names from options
        type: transaction.type, // Keep the original type (EXPENSE/INCOME)
        category:
          formOptions.categories.find((c) => c.value === data.category_id)
            ?.label || transaction.category,
        paymentMethod:
          formOptions.paymentMethods.find(
            (p) => p.value === data.payment_method_id
          )?.label || transaction.paymentMethod,
      };

      // Optimistically update the UI
      onOptimisticUpdate(transaction.id, updatedData);

      // Close the modal
      onClose();

      // Then perform the actual update
      await updateTransaction(transaction.id, {
        ...data,
        amount: amountInCents,
      });

      toast.success("Transaction updated successfully", { id: toastId });
    } catch (error) {
      console.error("Failed to update transaction:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update transaction",
        { id: toastId }
      );
      // Reload the page if the update fails to reset the state
      window.location.reload();
    }
  };

  return (
    <Form
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={onClose}
      initialData={transaction}
      submitText="Save Changes"
    />
  );
}
