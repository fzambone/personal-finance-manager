"use client";

import { Transaction } from "@/app/types/transaction";
import {
  getTransactions,
  getTransactionFormOptions,
  updateTransaction,
  deleteTransaction,
  type FilterOptions,
} from "@/services/domain/transactions";
import { useState, useEffect, useCallback } from "react";
import type { FormOptions } from "../types";
import useSWR from "swr";
export type { FormOptions };

export function useTransactionList(currentPage: number, itemsPerPage: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch transactions and form options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [transactionsResult, options] = await Promise.all([
          getTransactions(currentPage, itemsPerPage),
          getTransactionFormOptions(),
        ]);

        setTransactions(transactionsResult.data);
        setTotalPages(transactionsResult.totalPages);
        setFormOptions(options);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setError("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleUpdateTransaction = useCallback(
    (id: string, updatedData: Partial<Transaction> | undefined) => {
      setTransactions((prevTransactions) => {
        if (!updatedData) {
          // Remove the transaction if updatedData is undefined (for rollback)
          return prevTransactions.filter((t) => t.id !== id);
        }

        const existingIndex = prevTransactions.findIndex((t) => t.id === id);
        if (existingIndex === -1) {
          // If it's a new transaction, add it to the beginning
          const newTransaction = updatedData as Transaction;
          return [newTransaction, ...prevTransactions];
        }

        // Otherwise update the existing transaction
        const updatedTransactions = [...prevTransactions];
        updatedTransactions[existingIndex] = {
          ...updatedTransactions[existingIndex],
          ...updatedData,
        };
        return updatedTransactions;
      });
    },
    []
  );

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleFilterChange = useCallback(
    async (filters: FilterOptions) => {
      try {
        setIsLoading(true);
        const result = await getTransactions(
          currentPage,
          itemsPerPage,
          filters
        );
        setTransactions(result.data);
        setTotalPages(result.totalPages);
        setError(null);
      } catch (error) {
        console.error("Failed to filter transactions:", error);
        setError("Failed to filter transactions");
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  return {
    transactions,
    formOptions,
    isLoading,
    error,
    totalPages,
    handleUpdateTransaction,
    handleDeleteTransaction,
    handleFilterChange,
  };
}
