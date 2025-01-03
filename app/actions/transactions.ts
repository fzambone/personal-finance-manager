"use server";

import { Transaction } from "../types/transaction";
import {
  getTransactionFormOptions as getFormOptions,
  getTransactions as getTransactionsList,
  updateTransaction as updateTransactionData,
  deleteTransaction as deleteTransactionData,
  createTransaction as createTransactionData,
} from "@/services/domain/transactions";
import type { FormOptions } from "@/services/domain/transactions";
import { revalidateTag } from "next/cache";
import { withLogging } from "@/utils/server-action-logger";
import { TransactionError } from "@/app/core/errors/types";

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

export const createTransaction = withLogging(
  "createTransaction",
  async (data: Partial<Transaction>): Promise<Transaction> => {
    try {
      // Set the hardcoded user ID for new transactions
      const transactionData = {
        ...data,
        user_id: "d95ba6de-fce1-4fe9-92d7-88558dafce0a",
      };

      // Create the transaction (status will be set to APPROVED in the domain service)
      const result = await createTransactionData(transactionData);
      revalidateTag("transactions");
      return result; // Return the created transaction for optimistic updates
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    }
  }
);
