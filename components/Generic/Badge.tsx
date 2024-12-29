"use client";

type BadgeProps = {
  variant: "status" | "transaction";
  type: string;
};

const variantStyles = {
  status: {
    pending:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    completed:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    failed: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    processing:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    cancelled:
      "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300",
  },
  transaction: {
    income:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    expense: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  },
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default function Badge({ variant, type }: BadgeProps) {
  // Use lowercase for style lookup
  const normalizedType = type.toLowerCase();

  // Get the style based on variant and normalized type
  const style =
    variant === "status"
      ? variantStyles.status[
          normalizedType as keyof typeof variantStyles.status
        ]
      : variantStyles.transaction[
          normalizedType as keyof typeof variantStyles.transaction
        ];

  // Debug log
  console.log({
    variant,
    originalType: type,
    normalizedType,
    availableStyles: Object.keys(variantStyles[variant]),
    styleFound: !!variantStyles[variant][normalizedType],
    finalStyle: style,
  });

  // Capitalize for display
  const displayText = capitalizeFirstLetter(type);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {displayText}
    </span>
  );
}
