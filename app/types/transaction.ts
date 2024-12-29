export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: string;
  user_id: string;
  type_id: string;
  category_id: string;
  payment_method_id: string;
  date: string;
  user: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod: string;
  status: string;
  actions?: string;
};
