"use server";

import { Transaction } from "../types/transaction";
import {
  getTransactionFormOptions as getFormOptions,
  getTransactions as getTransactionsList,
  updateTransaction as updateTransactionData,
  deleteTransaction as deleteTransactionData,
} from "@/services/domain/transactions";
import type { FormOptions } from "@/services/domain/transactions";
import { revalidateTag } from "next/cache";
import { withLogging } from "@/utils/server-action-logger";

export const getTransactions = withLogging(
  "getTransactions",
  async (
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
  }> => {
    const result = await getTransactionsList(page, itemsPerPage, filters);
    return result;
  }
);

export const getTransactionFormOptions = withLogging(
  "getTransactionFormOptions",
  async (): Promise<FormOptions> => {
    return getFormOptions();
  }
);

export const updateTransaction = withLogging(
  "updateTransaction",
  async (id: string, data: Partial<Transaction>): Promise<void> => {
    try {
      await updateTransactionData(id, data);
      revalidateTag("transactions");
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export async function deleteTransaction(id: string): Promise<void> {
  try {
    await deleteTransactionData(id);
    revalidateTag("transactions");
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
