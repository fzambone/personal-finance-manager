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
      expense: "bg-rose-200/60 dark:bg-rose-300/50",
      income: "bg-emerald-200/60 dark:bg-emerald-300/50",
    },
    status: {
      pending:
        "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90",
      approved:
        "bg-emerald-100/80 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      rejected:
        "bg-rose-100/80 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      processing:
        "bg-violet-100/80 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
      cancelled:
        "bg-slate-100/80 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
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
