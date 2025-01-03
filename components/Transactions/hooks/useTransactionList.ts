"use client";

import { Transaction } from "@/app/types/transaction";
import {
  getTransactions,
  getTransactionFormOptions,
  updateTransaction,
  deleteTransaction,
} from "@/app/actions/transactions";
import { useState } from "react";
import type { FormOptions } from "@/services/domain/transactions";
import { FilterState } from "@/components/Generic/FilterBar";
import useSWR from "swr";
export type { FormOptions };

export function useTransactionList(
  page: number = 1,
  itemsPerPage: number = 10
) {
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Map<string, Transaction>
  >(new Map());

  const cacheKey = JSON.stringify([
    "transactions",
    page,
    itemsPerPage,
    filters,
  ]);

  const { data, error, isLoading, mutate } = useSWR(cacheKey, async () => {
    const [transactionsData, options] = await Promise.all([
      getTransactions(page, itemsPerPage, filters),
      getTransactionFormOptions(),
    ]);
    setFormOptions(options);
    return transactionsData;
  });

  const handleUpdateTransaction = async (
    id: string,
    updatedData: Partial<Transaction>
  ) => {
    if (!data) return;

    // Store the original transaction for potential rollback
    const originalTransaction = data.data.find((t) => t.id === id);
    if (!originalTransaction) return;

    // Save the original state for rollback
    setOptimisticUpdates((prev) => new Map(prev).set(id, originalTransaction));

    // Create optimistic data
    const optimisticData = {
      ...data,
      data: data.data.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedData } : transaction
      ),
    };

    try {
      // Update the UI immediately
      await mutate(optimisticData, false);

      // Clear the optimistic update after successful server update
      setOptimisticUpdates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    } catch (err) {
      console.error("Failed to update transaction:", err);

      // If there was an error, rollback to the original state
      if (optimisticUpdates.has(id)) {
        const originalTransaction = optimisticUpdates.get(id)!;
        await mutate(
          {
            ...data,
            data: data.data.map((transaction) =>
              transaction.id === id ? originalTransaction : transaction
            ),
          },
          false
        );

        // Clear the failed optimistic update
        setOptimisticUpdates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(id);
          return newMap;
        });
      }
      throw err;
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!data) return;

    // Create optimistic data
    const optimisticData = {
      ...data,
      data: data.data.filter((transaction) => transaction.id !== id),
      totalItems: data.totalItems - 1,
      totalPages: Math.ceil((data.totalItems - 1) / itemsPerPage),
    };

    try {
      // Start optimistic update
      await mutate(optimisticData, false);

      // Perform the actual delete
      await deleteTransaction(id);

      // Revalidate after successful delete
      await mutate();
    } catch (err) {
      // If error occurs, revalidate to get the correct state
      await mutate();
      throw err;
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Apply optimistic updates to the data before returning
  const transactions =
    data?.data.map((transaction) => {
      const optimisticUpdate = optimisticUpdates.get(transaction.id);
      return optimisticUpdate || transaction;
    }) || [];

  return {
    transactions,
    totalPages: data?.totalPages ?? 0,
    totalItems: data?.totalItems ?? 0,
    formOptions,
    isLoading,
    error: error?.message,
    handleUpdateTransaction,
    handleDeleteTransaction,
    handleFilterChange,
    filters,
  };
}
