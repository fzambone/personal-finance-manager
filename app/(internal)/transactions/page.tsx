"use client";

import {
  getTransactions,
  getTransactionFormOptions,
} from "@/app/actions/transactions";
import GenericList from "@/components/Generic/List";
import Badge from "@/components/Generic/Badge";
import { formatCurrency } from "@/utils/formatCurrency";
import TransactionActions from "@/components/Transactions/TransactionActions";
import { Transaction } from "@/app/types/transaction";
import { Columns } from "@/components/Generic/List";
import { useCallback, useEffect, useState } from "react";
import { TransactionError } from "@/services/domain/transactions";
import { toast } from "react-hot-toast";

type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "cancelled";

type FormOptions = {
  types: { label: string; value: string }[];
  categories: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
};

function useTransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [transactionsData, options] = await Promise.all([
        getTransactions(),
        getTransactionFormOptions(),
      ]);
      setTransactions(transactionsData);
      setFormOptions(options);
    } catch (error) {
      if (error instanceof TransactionError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load transactions");
      }
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to optimistically update a transaction
  const handleTransactionUpdate = useCallback(
    (id: string, updatedData: Partial<Transaction>) => {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === id
            ? { ...transaction, ...updatedData }
            : transaction
        )
      );
    },
    []
  );

  // Function to optimistically delete a transaction
  const handleTransactionDelete = useCallback((id: string) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    transactions,
    formOptions,
    isLoading,
    onUpdate: handleTransactionUpdate,
    onDelete: handleTransactionDelete,
  };
}

function TransactionsList() {
  const { transactions, formOptions, isLoading, onUpdate, onDelete } =
    useTransactionsList();

  const transactionTableColumns: Columns<Transaction>[] = [
    { key: "date", label: "Date" },
    { key: "user", label: "User" },
    { key: "name", label: "Description" },
    {
      key: "amount",
      label: "Amount",
      renderCell: (row: Transaction) => (
        <span
          className={row.type === "EXPENSE" ? "text-red-600" : "text-green-600"}
        >
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      renderCell: (row: Transaction) => (
        <Badge
          variant="transaction"
          type={row.type === "EXPENSE" ? "expense" : "income"}
        />
      ),
    },
    { key: "category", label: "Category" },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: Transaction) => (
        <Badge variant="status" type={row.status.toLowerCase() as StatusType} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (row: Transaction) => (
        <TransactionActions
          id={row.id}
          data={row}
          formOptions={formOptions}
          onOptimisticUpdate={onUpdate}
          onOptimisticDelete={onDelete}
        />
      ),
    },
  ];

  return (
    <GenericList
      columns={transactionTableColumns}
      data={transactions}
      isLoading={isLoading}
    />
  );
}

export default function TransactionsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
      </div>
      <TransactionsList />
    </div>
  );
}
