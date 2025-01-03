import { Transaction } from "@/app/types/transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import { FormField } from "../Generic/Form";
import { FormOptions } from "./hooks/useTransactionList";
import { memo, useEffect, useMemo } from "react";

type TransactionFormFieldsProps = {
  transaction: Transaction;
  formOptions: FormOptions;
  onFieldsChange: (fields: FormField[]) => void;
};

function TransactionFormFields({
  transaction,
  formOptions,
  onFieldsChange,
}: TransactionFormFieldsProps) {
  const fields: FormField[] = useMemo(
    () => [
      // Primary Information Group
      {
        name: "type_id",
        label: "Type",
        type: "select",
        value: transaction.type_id,
        options: formOptions.types,
        required: true,
        className: "col-span-2",
      },
      {
        name: "amount",
        label: "Amount",
        type: "text",
        value: formatCurrency(transaction.amount),
        required: true,
        placeholder: "R$ 0,00",
        inputMode: "numeric",
        className: "col-span-2",
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        value: transaction.date,
        required: true,
        className: "col-span-2",
      },

      // Description Group
      {
        name: "name",
        label: "Description",
        type: "text",
        value: transaction.name,
        required: true,
        className: "col-span-full",
      },

      // Classification Group
      {
        name: "category_id",
        label: "Category",
        type: "select",
        value: transaction.category_id,
        options: formOptions.categories,
        required: true,
        className: "col-span-3",
      },
      {
        name: "payment_method_id",
        label: "Payment Method",
        type: "select",
        value: transaction.payment_method_id,
        options: formOptions.paymentMethods,
        required: true,
        className: "col-span-3",
      },
    ],
    [
      transaction.name,
      transaction.amount,
      transaction.date,
      transaction.type_id,
      transaction.category_id,
      transaction.payment_method_id,
      formOptions.types,
      formOptions.categories,
      formOptions.paymentMethods,
    ]
  );

  useEffect(() => {
    onFieldsChange(fields);
  }, [fields, onFieldsChange]);

  return null;
}

export default memo(TransactionFormFields);
