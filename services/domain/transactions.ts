import { Transaction, TransactionType } from "@/app/types/transaction";
import { prisma } from "@/lib/db";

type TransactionResult = {
  id: string;
  user_id: string;
  type_id: string;
  category_id: string;
  payment_method_id: string;
  transaction_date: Date;
  description: string | null;
  amount: number;
  users: { first_name: string };
  transaction_types: { name: string };
  categories: { name: string };
  payment_methods: { name: string };
  transaction_status: { name: string };
};

type FormOption = {
  id: string;
  name: string;
};

interface PrismaError extends Error {
  code?: string;
}

function isPrismaError(error: unknown): error is PrismaError {
  return error instanceof Error && "code" in error;
}

export class TransactionError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "TransactionError";
  }
}

export interface TransactionService {
  getTransactions(): Promise<Transaction[]>;
  getTransactionFormOptions(userId?: string): Promise<{
    types: Array<{ label: string; value: string }>;
    categories: Array<{ label: string; value: string }>;
    paymentMethods: Array<{ label: string; value: string }>;
  }>;
  deleteTransaction(id: string): Promise<void>;
  updateTransaction(id: string, data: Partial<Transaction>): Promise<void>;
}

class TransactionServiceImpl implements TransactionService {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await prisma.transactions.findMany({
        select: {
          id: true,
          user_id: true,
          type_id: true,
          category_id: true,
          payment_method_id: true,
          transaction_date: true,
          description: true,
          amount: true,
          users: {
            select: { first_name: true },
          },
          transaction_types: {
            select: { name: true },
          },
          categories: {
            select: { name: true },
          },
          payment_methods: {
            select: { name: true },
          },
          transaction_status: {
            select: { name: true },
          },
        },
        orderBy: { transaction_date: "desc" },
      });

      return transactions.map((t: TransactionResult) => ({
        id: t.id,
        user_id: t.user_id,
        type_id: t.type_id,
        category_id: t.category_id,
        payment_method_id: t.payment_method_id,
        date: t.transaction_date,
        user: t.users.first_name,
        name: t.description || "",
        amount: t.amount,
        type: t.transaction_types.name as TransactionType,
        category: t.categories.name,
        paymentMethod: t.payment_methods.name,
        status: t.transaction_status.name,
      }));
    } catch (error) {
      throw new TransactionError("Failed to fetch transactions", error);
    }
  }

  async getTransactionFormOptions(userId?: string) {
    try {
      const [types, categories, paymentMethods] = await Promise.all([
        prisma.transaction_types.findMany({
          where: { deleted_at: null },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
        prisma.categories.findMany({
          where: { deleted_at: null },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
        prisma.payment_methods.findMany({
          where: {
            ...(userId ? { user_id: userId } : {}),
            deleted_at: null,
          },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
      ]);

      return {
        types: types.map((type: FormOption) => ({
          label: type.name.charAt(0) + type.name.slice(1).toLowerCase(),
          value: type.id,
        })),
        categories: categories.map((category: FormOption) => ({
          label: category.name,
          value: category.id,
        })),
        paymentMethods: paymentMethods.map((method: FormOption) => ({
          label: method.name,
          value: method.id,
        })),
      };
    } catch (error) {
      throw new TransactionError("Failed to fetch form options", error);
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      await prisma.transactions.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === "P2025") {
        throw new TransactionError("Transaction not found");
      }
      throw new TransactionError("Failed to delete transaction", error);
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
      if (isPrismaError(error) && error.code === "P2025") {
        throw new TransactionError("Transaction not found");
      }
      throw new TransactionError("Failed to update transaction", error);
    }
  }
}

// Export a singleton instance
export const transactionService: TransactionService =
  new TransactionServiceImpl();
