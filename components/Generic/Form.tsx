"use client";

import { ReactNode, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";

export type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  value: any;
  options?: { label: string; value: any }[];
  required?: boolean;
  placeholder?: string;
  step?: string;
  pattern?: string;
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
};

type FormProps = {
  fields: Field[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  initialData?: Record<string, any>;
  children?: ReactNode;
};

const baseInputClasses = `
  w-full rounded-lg
  border border-gray-300 dark:border-gray-600
  bg-white dark:bg-gray-700
  px-3 py-2 text-sm
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-500
  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
  focus:border-transparent
  disabled:bg-gray-50 dark:disabled:bg-gray-800
  disabled:text-gray-500 dark:disabled:text-gray-400
  disabled:cursor-not-allowed
  transition-colors duration-200
`;

export default function Form({
  fields,
  onSubmit,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  initialData = {},
  children,
}: FormProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    return fields.reduce((acc, field) => {
      let value = initialData[field.name] || field.value;

      // Format initial amount value
      if (field.name === "amount" && typeof value === "number") {
        value = formatCurrency(value);
      }

      acc[field.name] = value;
      return acc;
    }, {} as Record<string, any>);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: Field, value: string) => {
    let finalValue = value;

    // Handle currency formatting for amount field
    if (field.name === "amount") {
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, "");

      if (numericValue) {
        // Convert the numeric string to cents
        const cents = parseInt(numericValue, 10);
        if (!isNaN(cents)) {
          finalValue = formatCurrency(cents);
        }
      } else {
        finalValue = "";
      }
    }

    setFormValues((prev) => ({
      ...prev,
      [field.name]: finalValue,
    }));
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            value={formValues[field.name]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            required={field.required}
            className={baseInputClasses}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            value={formValues[field.name]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className={`${baseInputClasses} min-h-[100px] resize-y`}
          />
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={formValues[field.name]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            step={field.step}
            pattern={field.pattern}
            inputMode={field.inputMode}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      {children}

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     bg-gray-100 dark:bg-gray-800 
                     hover:bg-gray-200 dark:hover:bg-gray-700
                     rounded-lg 
                     border border-gray-300 dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500
                     transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white
                   bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                   rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                   transition-colors duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}
