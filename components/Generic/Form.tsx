"use client";

import { ReactNode } from "react";

export type Field = {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  value: any;
  options?: { label: string; value: any }[];
  required?: boolean;
  placeholder?: string;
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

export default function Form({
  fields,
  onSubmit,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  initialData = {},
  children,
}: FormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};

    // Convert form data to object with proper types
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Convert number fields
    fields.forEach((field) => {
      if (field.type === "number" && data[field.name]) {
        data[field.name] = Number(data[field.name]);
      }
    });

    await onSubmit(data);
  };

  const renderField = (field: Field) => {
    const baseClassName =
      "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            defaultValue={initialData[field.name] || field.value}
            required={field.required}
            className={baseClassName}
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
            defaultValue={initialData[field.name] || field.value}
            required={field.required}
            placeholder={field.placeholder}
            className={`${baseClassName} min-h-[100px]`}
          />
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            defaultValue={initialData[field.name] || field.value}
            required={field.required}
            placeholder={field.placeholder}
            className={baseClassName}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {cancelText}
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
