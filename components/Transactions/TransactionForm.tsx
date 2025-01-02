"use client";

import { Transaction } from "@/app/types/transaction";
import { getTransactionFormOptions } from "@/services/transactions";
import { updateTransaction } from "@/app/actions/transactions";
import { formatCurrency } from "@/utils/formatCurrency";
import Form, { Field } from "../Generic/Form";
import FormSkeleton from "../Skeletons/FormSkeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TransactionFormProps = {
  transaction: Transaction;
  onClose: () => void;
};

type FormOptions = {
  types: { label: string; value: string }[];
  categories: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
};

function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, "");
  // Convert string to number
  return parseInt(numericValue, 10) || 0;
}

export default function TransactionForm({
  transaction,
  onClose,
}: TransactionFormProps) {
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const formOptions = await getTransactionFormOptions(
          transaction.user_id
        );
        setOptions(formOptions);
      } catch (error) {
        console.error("Failed to load form options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, [transaction.user_id]);

  if (isLoading || !options) {
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
      options: options.types,
      required: true,
    },
    {
      name: "category_id",
      label: "Category",
      type: "select",
      value: transaction.category_id,
      options: options.categories,
      required: true,
    },
    {
      name: "payment_method_id",
      label: "Payment Method",
      type: "select",
      value: transaction.payment_method_id,
      options: options.paymentMethods,
      required: true,
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const amountInCents = parseCurrencyInput(data.amount);
      if (isNaN(amountInCents)) {
        throw new Error("Invalid amount format");
      }
      await updateTransaction(transaction.id, {
        ...data,
        amount: amountInCents,
      });
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Failed to update transaction:", error);
      // TODO: Add error handling UI
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
