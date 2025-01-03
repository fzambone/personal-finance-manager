import { Transaction } from "@/app/types/transaction";
import { formatCurrency } from "@/utils/formatCurrency";
import Badge from "@/components/Generic/Badge";
import GenericList from "@/components/Generic/List";
import { Columns } from "@/components/Generic/List";
import TransactionActions from "./TransactionActions";
import { FormOptions } from "./hooks/useTransactionList";
import TableSkeleton from "@/components/Skeletons/TableSkeleton";

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
  if (isLoading) {
    return <TableSkeleton />;
  }

  const columns: Columns<Transaction>[] = [
    {
      key: "date",
      label: "Date",
      renderCell: (row: Transaction) => {
        // Split the date string and create a date object in local timezone
        const [year, month, day] = row.date.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        return (
          <span className="table-cell">
            {date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    { key: "user", label: "User" },
    {
      key: "name",
      label: "Description",
      renderCell: (row: Transaction) => (
        <div className="flex items-center gap-2">
          <Badge
            variant="transaction"
            type={row.type === "EXPENSE" ? "expense" : "income"}
            className="w-2 h-2 rounded-full p-0"
          />
          <span>{row.name}</span>
        </div>
      ),
    },
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
    { key: "category", label: "Category" },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "status",
      label: "Status",
      renderCell: (row: Transaction) => (
        <Badge
          variant="status"
          type={row.status.toLowerCase() as StatusType}
          className="px-2.5 py-0.5 rounded-full text-xs font-medium"
        />
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

  return <GenericList columns={columns} data={data} />;
}
