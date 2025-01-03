import { Transaction } from "@/app/types/transaction";
import { prisma } from "../../lib/prisma";
import { TransactionError } from "../../services/domain/errors";
import { Prisma } from "@prisma/client";

export { TransactionError };

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

interface FilterOptions {
  search?: string;
  dateRange?: { start: string; end: string };
  amountRange?: { min: number; max: number };
  types?: string[];
  categories?: string[];
  paymentMethods?: string[];
  statuses?: string[];
}

export class TransactionService {
  async getTransactions(
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
                    first_name: {
                      contains: filters.search,
                      mode: "insensitive",
                    },
                  },
                  {
                    last_name: {
                      contains: filters.search,
                      mode: "insensitive",
                    },
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

  async getTransactionFormOptions(userId?: string): Promise<FormOptions> {
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

  async deleteTransaction(id: string): Promise<void> {
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

  async updateTransaction(
    id: string,
    data: Partial<Transaction>
  ): Promise<void> {
    try {
      await prisma.transactions.update({
        where: { id },
        data: {
          description: data.name,
          amount: data.amount,
          transaction_date: data.date,
          type_id: data.type_id,
          category_id: data.category_id,
          payment_method_id: data.payment_method_id,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to update transaction:", error);
      throw new TransactionError("Failed to update transaction");
    }
  }
}

export const transactionService = new TransactionService();
