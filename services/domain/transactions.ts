"use server";

import { Transaction } from "@/app/types/transaction";
import { prisma } from "@/services/infrastructure/prisma";
import { Prisma } from "@prisma/client";
import { TransactionError } from "@/app/core/errors/types";
import { toSelectOptions } from "@/app/utils/transformers/optionTransformers";

export type FormOptions = {
  types: { label: string; value: string }[];
  categories: { label: string; value: string }[];
  paymentMethods: { label: string; value: string }[];
};

export type PaginatedTransactions = {
  data: Transaction[];
  totalPages: number;
  totalItems: number;
};

export type FilterOptions = {
  search?: string;
  dateRange?: { start: string; end: string };
  amountRange?: { min: number; max: number };
  types?: string[];
  categories?: string[];
  paymentMethods?: string[];
  statuses?: string[];
};

export async function getTransactions(
  page: number = 1,
  itemsPerPage: number = 10,
  filters?: FilterOptions
): Promise<PaginatedTransactions> {
  try {
    const where: Prisma.transactionsWhereInput = {
      deleted_at: null,
      ...(filters?.search && {
        OR: [
          { description: { contains: filters.search, mode: "insensitive" } },
          {
            users: {
              OR: [
                {
                  first_name: { contains: filters.search, mode: "insensitive" },
                },
                {
                  last_name: { contains: filters.search, mode: "insensitive" },
                },
              ],
            },
          },
        ],
      }),
      ...(filters?.dateRange && {
        transaction_date: {
          gte: filters.dateRange.start,
          lte: filters.dateRange.end,
        },
      }),
      ...(filters?.amountRange && {
        amount: {
          gte: filters.amountRange.min,
          lte: filters.amountRange.max,
        },
      }),
      ...(filters?.types?.length && {
        type_id: { in: filters.types },
      }),
      ...(filters?.categories?.length && {
        category_id: { in: filters.categories },
      }),
      ...(filters?.paymentMethods?.length && {
        payment_method_id: { in: filters.paymentMethods },
      }),
      ...(filters?.statuses?.length && {
        status_id: { in: filters.statuses },
      }),
    };

    const cacheKey = JSON.stringify({ page, itemsPerPage, filters });
    const [transactions, totalItems] = await Promise.all([
      prisma.transactions.findMany({
        where,
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        include: {
          users: true,
          categories: true,
          payment_methods: true,
          transaction_types: true,
          transaction_status: true,
        },
        orderBy: {
          transaction_date: "desc",
        },
      }),
      prisma.transactions.count({ where }),
    ]);

    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      user_id: transaction.user_id,
      type_id: transaction.type_id,
      category_id: transaction.category_id,
      payment_method_id: transaction.payment_method_id,
      status_id: transaction.status_id,
      date: transaction.transaction_date,
      user: `${transaction.users.first_name} ${transaction.users.last_name}`,
      name: transaction.description || "",
      amount: transaction.amount,
      type: transaction.transaction_types.name,
      category: transaction.categories.name,
      paymentMethod: transaction.payment_methods.name,
      status: transaction.transaction_status.name.toLowerCase(),
    }));

    return {
      data: formattedTransactions,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new TransactionError("Failed to fetch transactions");
  }
}

export async function getTransactionFormOptions(
  userId?: string
): Promise<FormOptions> {
  try {
    const [types, categories, paymentMethods] = await Promise.all([
      prisma.transaction_types.findMany({
        where: { deleted_at: null },
        select: { id: true, name: true },
      }),
      prisma.categories.findMany({
        where: { deleted_at: null },
        select: { id: true, name: true },
      }),
      prisma.payment_methods.findMany({
        where: {
          deleted_at: null,
          ...(userId ? { user_id: userId } : {}),
        },
        select: { id: true, name: true },
      }),
    ]);

    return {
      types: types.map((type) => ({
        label: type.name,
        value: type.id,
      })),
      categories: categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
      paymentMethods: paymentMethods.map((method) => ({
        label: method.name,
        value: method.id,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch form options:", error);
    throw new TransactionError("Failed to fetch form options");
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    await prisma.transactions.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw new TransactionError("Failed to delete transaction");
  }
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
): Promise<void> {
  try {
    console.log("Updating transaction:", { id, data });
    const result = await prisma.transactions.update({
      where: { id },
      data: {
        description: data.name,
        amount: data.amount,
        transaction_date: data.date,
        type_id: data.type_id,
        category_id: data.category_id,
        payment_method_id: data.payment_method_id,
        status_id: data.status_id,
        updated_at: new Date(),
      },
    });
    console.log("Update result:", result);
  } catch (error) {
    console.error("Failed to update transaction:", error);
    throw new TransactionError("Failed to update transaction");
  }
}

/**
 * Gets the ID of the APPROVED status from the transaction_status table
 * @returns Promise<string> The ID of the APPROVED status
 * @throws TransactionError if the APPROVED status is not found
 */
async function getApprovedStatusId(): Promise<string> {
  const status = await prisma.transaction_status.findFirst({
    where: {
      name: "APPROVED",
      deleted_at: null,
    },
    select: {
      id: true,
    },
  });

  if (!status) {
    throw new TransactionError("APPROVED status not found");
  }

  return status.id;
}

/**
 * Creates a new transaction with APPROVED status
 * @param data Partial transaction data
 * @returns Promise<Transaction> The created transaction
 * @throws TransactionError if required fields are missing or if creation fails
 */
export async function createTransaction(
  data: Partial<Transaction>
): Promise<Transaction> {
  try {
    console.log("Creating transaction:", data);

    // Get the approved status ID
    const statusId = await getApprovedStatusId();

    // Validate required fields
    if (
      !data.name ||
      !data.date ||
      !data.type_id ||
      !data.category_id ||
      !data.payment_method_id ||
      !data.user_id
    ) {
      throw new TransactionError(
        "Missing required fields for transaction creation"
      );
    }

    // Create the transaction
    const result = await prisma.transactions.create({
      data: {
        description: data.name,
        amount: data.amount || 0,
        transaction_date: data.date,
        type_id: data.type_id,
        category_id: data.category_id,
        payment_method_id: data.payment_method_id,
        user_id: data.user_id,
        status_id: statusId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        users: true,
        categories: true,
        payment_methods: true,
        transaction_types: true,
        transaction_status: true,
      },
    });

    // Format the transaction to match our Transaction type
    const formattedTransaction: Transaction = {
      id: result.id,
      user_id: result.user_id,
      type_id: result.type_id,
      category_id: result.category_id,
      payment_method_id: result.payment_method_id,
      status_id: result.status_id,
      date: result.transaction_date,
      user: `${result.users.first_name} ${result.users.last_name}`,
      name: result.description || "",
      amount: result.amount,
      type: result.transaction_types.name,
      category: result.categories.name,
      paymentMethod: result.payment_methods.name,
      status: result.transaction_status.name.toLowerCase(),
    };

    console.log("Create result:", formattedTransaction);
    return formattedTransaction;
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw new TransactionError("Failed to create transaction");
  }
}
