"use client";

type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "cancelled";
type TransactionType = "income" | "expense";

type BadgeProps = {
  variant: "transaction" | "status";
  type: TransactionType | StatusType;
  className?: string;
};

export default function Badge({ variant, type, className = "" }: BadgeProps) {
  const variantClasses = {
    transaction: {
      expense: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      income:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    status: {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      approved:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      cancelled:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    },
  };

  return (
    <span
      className={`badge ${
        variantClasses[variant][
          type as keyof (typeof variantClasses)[typeof variant]
        ]
      } ${className}`}
    >
      {variant === "transaction" ? "" : type}
    </span>
  );
}
