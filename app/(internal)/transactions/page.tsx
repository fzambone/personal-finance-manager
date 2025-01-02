"use client";

import {
  getTransactions,
  getTransactionFormOptions,
} from "@/services/transactions";
import GenericList from "@/components/Generic/List";
import Badge from "@/components/Generic/Badge";
import { formatCurrency } from "@/utils/formatCurrency";
import TransactionActions from "@/components/Transactions/TransactionActions";
import { Transaction } from "@/app/types/transaction";
import { Columns } from "@/components/Generic/List";
import { useEffect, useState } from "react";

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

function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [transactionsData, options] = await Promise.all([
        getTransactions(),
        // Get form options without user dependency
        getTransactionFormOptions(),
      ]);
      setTransactions(transactionsData);
      setFormOptions(options);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to optimistically update a transaction
  const handleTransactionUpdate = (
    id: string,
    updatedData: Partial<Transaction>
  ) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedData } : transaction
      )
    );
  };

  // Function to optimistically delete a transaction
  const handleTransactionDelete = (id: string) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  };

  useEffect(() => {
    loadData();
  }, []);

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
          onOptimisticUpdate={handleTransactionUpdate}
          onOptimisticDelete={handleTransactionDelete}
        />
      ),
    },
  ];

  return (
    <GenericList
      columns={transactionTableColumns.map((column) =>
        column.key === "actions"
          ? {
              ...column,
              renderCell: (row: Transaction) => (
                <TransactionActions
                  id={row.id}
                  data={row}
                  formOptions={formOptions}
                  onOptimisticUpdate={handleTransactionUpdate}
                  onOptimisticDelete={handleTransactionDelete}
                />
              ),
            }
          : column
      )}
      data={transactions}
      isLoading={isLoading}
    />
  );
}

function TransactionsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-100 dark:bg-gray-800 rounded"
          ></div>
        ))}
      </div>
    </div>
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
