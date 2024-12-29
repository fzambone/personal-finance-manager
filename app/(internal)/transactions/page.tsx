"use server";

import { getTransactions } from "@/services/transactions";
import GenericList from "@/components/Generic/List";
import Badge from "@/components/Generic/Badge";
import { formatCurrency } from "@/utils/formatCurrency";
import TransactionActions from "@/components/Transactions/TransactionActions";
import { Transaction } from "@/app/types/transaction";
import { Columns } from "@/components/Generic/List";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

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
        <Badge variant="transaction" type={row.type} />
      ),
    },
    { key: "category", label: "Category" },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: Transaction) => (
        <Badge variant="status" type={row.status} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      renderCell: (row: Transaction) => (
        <TransactionActions id={row.id} data={row} />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
      </div>
      <GenericList columns={transactionTableColumns} data={transactions} />
    </div>
  );
}
