"use server";

import {
  deleteTransactionById,
  updateTransactionById,
} from "@/services/transactions";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(id: string) {
  try {
    await deleteTransactionById(id);
    revalidatePath("/transactions");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete transaction");
  }
}

export async function updateTransaction(id: string, data: any) {
  try {
    await updateTransactionById(id, data);
    revalidatePath("/transactions", "page");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to edit transaction");
  }
}
