import { Transaction } from "@/app/types/transaction";
import {
  getTransactions,
  getTransactionFormOptions,
} from "@/app/actions/transactions";
import { useCallback, useEffect, useState } from "react";
import { TransactionError } from "@/services/domain/transactions";
import { toast } from "react-hot-toast";

export type FormOptions = {
  types: { label: string; value: string }[];
  categories: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
};

export function useTransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [transactionsData, options] = await Promise.all([
        getTransactions(),
        getTransactionFormOptions(),
      ]);
      setTransactions(transactionsData);
      setFormOptions(options);
    } catch (error) {
      const message =
        error instanceof TransactionError
          ? error.message
          : "Failed to load transactions";
      setError(message);
      toast.error(message);
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    error,
    onUpdate: handleTransactionUpdate,
    onDelete: handleTransactionDelete,
    refresh: loadData,
  };
}
