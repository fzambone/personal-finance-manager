"use client";

import { Transaction } from "@/app/types/transaction";
import Form, { Field } from "../Generic/Form";
import FormSkeleton from "../Skeletons/FormSkeleton";
import { useEffect, useState, useCallback } from "react";
import TransactionFormFields from "./TransactionFormFields";
import {
  useTransactionForm,
  TransactionFormData,
} from "./hooks/useTransactionForm";
import { FormOptions } from "./hooks/useTransactionList";

type TransactionFormProps = {
  transaction: Transaction;
  formOptions: FormOptions | null;
  onClose: () => void;
  onOptimisticUpdate: (id: string, updatedData: Partial<Transaction>) => void;
};

export default function TransactionForm({
  transaction,
  formOptions,
  onClose,
  onOptimisticUpdate,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState<Field[]>([]);
  const { isSubmitting, handleSubmit } = useTransactionForm(
    transaction,
    formOptions,
    onClose,
    onOptimisticUpdate
  );

  useEffect(() => {
    // If we have form options, we're ready to show the form
    if (formOptions) {
      setIsLoading(false);
    }
  }, [formOptions]);

  const handleFieldsChange = useCallback((newFields: Field[]) => {
    setFields(newFields);
  }, []);

  if (isLoading || !formOptions) {
    return <FormSkeleton />;
  }

  return (
    <>
      <TransactionFormFields
        transaction={transaction}
        formOptions={formOptions}
        onFieldsChange={handleFieldsChange}
      />
      <Form<TransactionFormData>
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={onClose}
        initialData={transaction}
        submitText={isSubmitting ? "Saving..." : "Save Changes"}
        disabled={isSubmitting}
      />
    </>
  );
}
