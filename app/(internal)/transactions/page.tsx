"use client";

import { useTransactionList } from "@/components/Transactions/hooks/useTransactionList";
import TransactionTable from "@/components/Transactions/TransactionTable";
import Pagination from "@/components/Generic/Pagination";
import FilterBar from "@/components/Generic/FilterBar";
import Modal from "@/components/Generic/Modal";
import TransactionForm from "@/components/Transactions/TransactionForm";
import { Transaction } from "@/app/types/transaction";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

// Empty transaction template for new transactions
const emptyTransaction: Transaction = {
  id: "",
  user_id: "d95ba6de-fce1-4fe9-92d7-88558dafce0a",
  type_id: "",
  category_id: "",
  payment_method_id: "",
  status_id: "2",
  name: "",
  amount: 0,
  type: "",
  category: "",
  paymentMethod: "",
  date: new Date().toISOString().split("T")[0],
  user: "System User",
  status: "approved",
};

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);

  const {
    transactions,
    formOptions,
    isLoading,
    error,
    totalPages,
    handleUpdateTransaction,
    handleDeleteTransaction,
    handleFilterChange,
  } = useTransactionList(currentPage, ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCloseNewTransaction = () => {
    setShowNewTransactionModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <button
          onClick={() => setShowNewTransactionModal(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 active:bg-primary/80"
        >
          Add New
        </button>
      </div>

      {formOptions && (
        <FilterBar
          formOptions={formOptions}
          onFilterChange={handleFilterChange}
        />
      )}

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <TransactionTable
            data={transactions || []}
            formOptions={formOptions}
            isLoading={isLoading}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Modal
        isOpen={showNewTransactionModal}
        onClose={handleCloseNewTransaction}
        title="New Transaction"
        description="Create a new transaction"
        size="2xl"
      >
        <TransactionForm
          transaction={emptyTransaction}
          formOptions={formOptions}
          onClose={handleCloseNewTransaction}
          onOptimisticUpdate={handleUpdateTransaction}
        />
      </Modal>
    </div>
  );
}
