"use server";

import { Transaction } from "../types/transaction";
import {
  getTransactionFormOptions as getFormOptions,
  getTransactions as getTransactionsList,
  updateTransaction as updateTransactionData,
  deleteTransaction as deleteTransactionData,
} from "@/services/domain/transactions";
import type { FormOptions } from "@/services/domain/transactions";

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
  return getTransactionsList(page, itemsPerPage, filters);
}

export async function getTransactionFormOptions(): Promise<FormOptions> {
  return getFormOptions();
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
): Promise<void> {
  return updateTransactionData(id, data);
}

export async function deleteTransaction(id: string): Promise<void> {
  return deleteTransactionData(id);
}
