"use server";

import { Transaction } from "@/app/types/transaction";
import { transactionService } from "@/services/domain/transactions";
import { revalidatePath } from "next/cache";

export async function getTransactions() {
  return await transactionService.getTransactions();
}

export async function getTransactionFormOptions(userId?: string) {
  return await transactionService.getTransactionFormOptions(userId);
}

export async function deleteTransaction(id: string) {
  await transactionService.deleteTransaction(id);
  revalidatePath("/transactions");
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
) {
  await transactionService.updateTransaction(id, data);
  revalidatePath("/transactions");
}
