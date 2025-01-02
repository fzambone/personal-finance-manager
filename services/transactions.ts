"use server";

import { Transaction, TransactionType } from "@/app/types/transaction";
import { prisma } from "@/lib/db";

export async function getTransactions(): Promise<Transaction[]> {
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

  return transactions.map(
    (t: {
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
    }) => ({
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
    })
  );
}

export async function getTransactionFormOptions(userId?: string) {
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
    types: types.map((type: { id: string; name: string }) => ({
      label: type.name.charAt(0) + type.name.slice(1).toLowerCase(),
      value: type.id,
    })),
    categories: categories.map((category: { id: string; name: string }) => ({
      label: category.name,
      value: category.id,
    })),
    paymentMethods: paymentMethods.map(
      (method: { id: string; name: string }) => ({
        label: method.name,
        value: method.id,
      })
    ),
  };
}

export async function deleteTransactionById(id: string): Promise<void> {
  await prisma.transactions.delete({
    where: { id },
  });
}

export async function updateTransactionById(
  id: string,
  data: any
): Promise<void> {
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
}
