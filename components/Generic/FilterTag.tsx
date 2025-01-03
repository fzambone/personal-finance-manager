"use client";

interface FilterTagProps {
  label: string;
  value: any;
  onRemove: () => void;
}

export default function FilterTag({ label, value, onRemove }: FilterTagProps) {
  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.length + " selected";
    }
    if (typeof value === "object") {
      if ("start" in value && "end" in value) {
        return `${value.start} to ${value.end}`;
      }
      if ("min" in value && "max" in value) {
        return `${value.min} to ${value.max}`;
      }
    }
    return value.toString();
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">
      <span className="text-sm font-medium">
        {label}: {formatValue(value)}
      </span>
      <button
        onClick={onRemove}
        className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
      >
        ×
      </button>
    </div>
  );
}
