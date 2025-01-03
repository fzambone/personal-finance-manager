"use server";

import { Transaction } from "../types/transaction";
import { TransactionService } from "@/services/domain/transactions";
import type { FormOptions } from "@/services/domain/transactions";

const transactionService = new TransactionService();

export async function getTransactions(
  page?: number,
  itemsPerPage?: number,
  filters?: {
    search?: string;
    dateRange?: { start: string; end: string };
    amountRange?: { min: number; max: number };
    types?: string[];
    categories?: string[];
    paymentMethods?: string[];
    statuses?: string[];
  }
): Promise<{
  data: Transaction[];
  totalPages: number;
  totalItems: number;
}> {
  return transactionService.getTransactions(page, itemsPerPage, filters);
}

export async function getTransactionFormOptions(): Promise<FormOptions> {
  return transactionService.getTransactionFormOptions();
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
): Promise<void> {
  return transactionService.updateTransaction(id, data);
}

export async function deleteTransaction(id: string): Promise<void> {
  return transactionService.deleteTransaction(id);
}
