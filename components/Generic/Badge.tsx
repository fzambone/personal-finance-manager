"use client";

type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "cancelled";
type TransactionType = "income" | "expense";

type BadgeProps =
  | { variant: "status"; type: StatusType }
  | { variant: "transaction"; type: TransactionType };

const variantStyles = {
  status: {
    pending:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    approved:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    rejected: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    processing:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    cancelled:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
  },
  transaction: {
    income:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    expense: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  },
} as const;

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default function Badge(props: BadgeProps) {
  const normalizedType = props.type.toLowerCase();

  const style =
    props.variant === "status"
      ? variantStyles.status[normalizedType as StatusType]
      : variantStyles.transaction[normalizedType as TransactionType];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {capitalizeFirstLetter(props.type)}
    </span>
  );
}
