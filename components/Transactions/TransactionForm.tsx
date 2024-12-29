"use client";

import { Transaction } from "@/app/types/transaction";
import { getTransactionFormOptions } from "@/services/transactions";
import { updateTransaction } from "@/app/actions/transactions";
import Form, { Field } from "../Generic/Form";
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
    return <div className="p-4 text-center">Loading form options...</div>;
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
      label: "Amount (in cents)",
      type: "number",
      value: transaction.amount,
      required: true,
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
      await updateTransaction(transaction.id, data);
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
