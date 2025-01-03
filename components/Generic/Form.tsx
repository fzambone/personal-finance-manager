"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";

export type FormField = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  inputMode?: "numeric" | "text";
  formatter?: (value: string) => string;
  className?: string;
};

type FormProps<T extends Record<string, any>> = {
  fields: FormField[];
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<T>;
  submitText?: string;
  disabled?: boolean;
};

export default function Form<T extends Record<string, any>>({
  fields,
  onSubmit,
  onCancel,
  initialData,
  submitText = "Submit",
  disabled = false,
}: FormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(() => {
    if (!initialData) return {};

    // Format initial data
    return fields.reduce((acc, field) => {
      if (field.name === "amount" && field.inputMode === "numeric") {
        acc[field.name as keyof T] = formatCurrency(
          initialData[field.name as keyof T] || 0
        ) as T[keyof T];
      } else {
        acc[field.name as keyof T] = (initialData[field.name as keyof T] ||
          "") as T[keyof T];
      }
      return acc;
    }, {} as Partial<T>);
  });

  useEffect(() => {
    if (initialData) {
      // Format data when initialData changes
      setFormData(
        fields.reduce((acc, field) => {
          if (field.name === "amount" && field.inputMode === "numeric") {
            acc[field.name as keyof T] = formatCurrency(
              initialData[field.name as keyof T] || 0
            ) as T[keyof T];
          } else {
            acc[field.name as keyof T] = (initialData[field.name as keyof T] ||
              "") as T[keyof T];
          }
          return acc;
        }, {} as Partial<T>)
      );
    }
  }, [initialData, fields]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as T);
  };

  const handleChange = (name: string, value: string, field: FormField) => {
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
    } else if (field.formatter) {
      finalValue = field.formatter(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-6 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.className}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
            >
              {field.label}
              {field.required && (
                <span className="ml-1 text-red-500" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            <div>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof T] || ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value, field)
                  }
                  required={field.required}
                  disabled={disabled}
                  className="block w-full pl-3 pr-10 py-2.5 text-base 
                    border border-gray-300 dark:border-gray-600 
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                    hover:border-gray-400 dark:hover:border-gray-500
                    sm:text-sm rounded-md 
                    dark:bg-gray-800 dark:text-white
                    transition-colors duration-200"
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
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
                  value={formData[field.name as keyof T] || ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value, field)
                  }
                  required={field.required}
                  placeholder={field.placeholder}
                  inputMode={field.inputMode}
                  disabled={disabled}
                  className="block w-full py-2.5 px-3
                    border border-gray-300 dark:border-gray-600 
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                    hover:border-gray-400 dark:hover:border-gray-500
                    rounded-md shadow-sm 
                    dark:bg-gray-800 dark:text-white
                    transition-colors duration-200"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="bg-white dark:bg-gray-800 
            py-2.5 px-5 
            border border-gray-300 dark:border-gray-600 
            hover:border-gray-400 dark:hover:border-gray-500
            hover:bg-gray-50 dark:hover:bg-gray-700
            rounded-md shadow-sm 
            text-sm font-medium text-gray-700 dark:text-gray-200 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex justify-center 
            py-2.5 px-5 
            border border-transparent 
            shadow-sm text-sm font-medium rounded-md 
            text-white bg-primary hover:bg-primary/90 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
