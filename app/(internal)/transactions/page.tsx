"use client";

import { useTransactionList } from "@/components/Transactions/hooks/useTransactionList";
import TransactionTable from "@/components/Transactions/TransactionTable";
import Pagination from "@/components/Generic/Pagination";
import FilterBar from "@/components/Generic/FilterBar";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    transactions,
    formOptions,
    isLoading,
    error,
    totalPages,
    onUpdate,
    onDelete,
    onFilterChange,
  } = useTransactionList(currentPage, ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
      </div>

      {formOptions && (
        <FilterBar formOptions={formOptions} onFilterChange={onFilterChange} />
      )}

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <TransactionTable
            data={transactions || []}
            formOptions={formOptions}
            isLoading={isLoading}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
