"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";

export type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  value: string | number;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  inputMode?: "numeric" | "text";
};

type FormProps<T> = {
  fields: Field[];
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  initialData?: Record<string, any>;
  submitText?: string;
  disabled?: boolean;
};

export default function Form<T>({
  fields,
  onSubmit,
  onCancel,
  initialData,
  submitText = "Submit",
  disabled = false,
}: FormProps<T>) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (!initialData) return {};

    // Format initial data
    return fields.reduce((acc, field) => {
      if (field.name === "amount" && field.inputMode === "numeric") {
        acc[field.name] = formatCurrency(initialData[field.name] || 0);
      } else {
        acc[field.name] = initialData[field.name] || "";
      }
      return acc;
    }, {} as Record<string, any>);
  });

  useEffect(() => {
    if (initialData) {
      // Format data when initialData changes
      setFormData(
        fields.reduce((acc, field) => {
          if (field.name === "amount" && field.inputMode === "numeric") {
            acc[field.name] = formatCurrency(initialData[field.name] || 0);
          } else {
            acc[field.name] = initialData[field.name] || "";
          }
          return acc;
        }, {} as Record<string, any>)
      );
    }
  }, [initialData, fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as T);
  };

  const handleChange = (name: string, value: string, field: Field) => {
    let finalValue = value;

    // Handle currency formatting for amount field
    if (name === "amount" && field.inputMode === "numeric") {
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

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {field.label}
            {field.required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
          <div className="mt-1">
            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) =>
                  handleChange(field.name, e.target.value, field)
                }
                required={field.required}
                disabled={disabled}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                value={formData[field.name] || ""}
                onChange={(e) =>
                  handleChange(field.name, e.target.value, field)
                }
                required={field.required}
                placeholder={field.placeholder}
                inputMode={field.inputMode}
                disabled={disabled}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-end space-x-3 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
