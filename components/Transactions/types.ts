import { Transaction } from "@/app/types/transaction";

export type TransactionFormData = Omit<Transaction, "amount"> & {
  amount: string;
};

export type FormOptions = {
  types: { label: string; value: string }[];
  categories: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
};

export type OptimisticUpdateFn = (
  id: string,
  updatedData: Partial<Transaction> | undefined
) => void;

export type TransactionFormProps = {
  transaction: Transaction;
  formOptions: FormOptions | null;
  onClose: () => void;
  onOptimisticUpdate: OptimisticUpdateFn;
};

export type TransactionActionsProps = {
  id: string;
  data: Transaction;
  formOptions: FormOptions | null;
  onOptimisticUpdate: OptimisticUpdateFn;
  onOptimisticDelete: (id: string) => void;
};
