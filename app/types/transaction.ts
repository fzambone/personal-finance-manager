export interface Transaction {
  id: string;
  user_id: string;
  type_id: string;
  category_id: string;
  payment_method_id: string;
  status_id: string;
  date: string;
  user: string;
  name: string;
  amount: number;
  type: string;
  category: string;
  paymentMethod: string;
  status: string;
}
