import { Transaction } from "@/app/types/transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import Badge from "@/components/Generic/Badge";
import GenericList from "@/components/Generic/List";
import { Columns } from "@/components/Generic/List";
import TransactionActions from "./TransactionActions";
import { FormOptions } from "./hooks/useTransactionList";

type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "cancelled";

type TransactionTableProps = {
  data: Transaction[];
  formOptions: FormOptions | null;
  isLoading: boolean;
  onUpdate: (id: string, updatedData: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
};

export default function TransactionTable({
  data,
  formOptions,
  isLoading,
  onUpdate,
  onDelete,
}: TransactionTableProps) {
  const columns: Columns<Transaction>[] = [
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

  return <GenericList columns={columns} data={data} isLoading={isLoading} />;
}
