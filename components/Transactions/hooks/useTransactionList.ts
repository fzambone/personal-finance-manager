"use client";

import { Transaction } from "@/app/types/transaction";
import {
  getTransactions,
  getTransactionFormOptions,
  updateTransaction,
  deleteTransaction,
} from "@/app/actions/transactions";
import { useCallback, useEffect, useState } from "react";
import type { FormOptions } from "@/services/domain/transactions";
import { FilterState } from "@/components/Generic/FilterBar";
export type { FormOptions };

export function useTransactionList(
  page: number = 1,
  itemsPerPage: number = 10
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<FilterState>({});

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [transactionsData, options] = await Promise.all([
        getTransactions(page, itemsPerPage, filters),
        getTransactionFormOptions(),
      ]);

      setTransactions(transactionsData.data);
      setTotalPages(transactionsData.totalPages);
      setTotalItems(transactionsData.totalItems);
      setFormOptions(options);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [page, itemsPerPage, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const onUpdate = useCallback(
    async (id: string, data: Partial<Transaction>) => {
      try {
        await updateTransaction(id, data);
        await fetchData();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update transaction"
        );
      }
    },
    [fetchData]
  );

  const onDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTransaction(id);
        await fetchData();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete transaction"
        );
      }
    },
    [fetchData]
  );

  return {
    transactions,
    formOptions,
    isLoading,
    error,
    totalPages,
    totalItems,
    onUpdate,
    onDelete,
    filters,
    onFilterChange: handleFilterChange,
  };
}
