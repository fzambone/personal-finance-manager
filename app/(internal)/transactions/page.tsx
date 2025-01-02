"use client";

import { useTransactionList } from "@/components/Transactions/hooks/useTransactionList";
import TransactionTable from "@/components/Transactions/TransactionTable";

export default function TransactionsPage() {
  const { transactions, formOptions, isLoading, error, onUpdate, onDelete } =
    useTransactionList();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
      </div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <TransactionTable
          data={transactions}
          formOptions={formOptions}
          isLoading={isLoading}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
