"use client";

import { useState } from "react";
import { FilterOption } from "@/app/types/filters";

interface FilterDropdownProps {
  label: string;
  type?: "dateRange" | "amountRange";
  options?: FilterOption[];
  value?: any;
  onChange: (value: any) => void;
  multiSelect?: boolean;
}

export default function FilterDropdown({
  label,
  type,
  options = [],
  value,
  onChange,
  multiSelect,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateRangeChange = (field: "start" | "end", date: string) => {
    onChange({ ...value, [field]: date });
  };

  const handleAmountRangeChange = (field: "min" | "max", amount: string) => {
    onChange({ ...value, [field]: Number(amount) });
  };

  const handleOptionToggle = (optionValue: string) => {
    if (!multiSelect) {
      onChange(optionValue);
      setIsOpen(false);
      return;
    }

    const newValue = value ? [...value] : [];
    const index = newValue.indexOf(optionValue);
    if (index === -1) {
      newValue.push(optionValue);
    } else {
      newValue.splice(index, 1);
    }
    onChange(newValue);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
          <div className="p-2">
            {type === "dateRange" && (
              <div className="space-y-2">
                <input
                  type="date"
                  value={value?.start || ""}
                  onChange={(e) =>
                    handleDateRangeChange("start", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  value={value?.end || ""}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {type === "amountRange" && (
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min amount"
                  value={value?.min || ""}
                  onChange={(e) =>
                    handleAmountRangeChange("min", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Max amount"
                  value={value?.max || ""}
                  onChange={(e) =>
                    handleAmountRangeChange("max", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {!type &&
              options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleOptionToggle(option.value)}
                >
                  {multiSelect ? (
                    <input
                      type="checkbox"
                      checked={value?.includes(option.value)}
                      readOnly
                      className="mr-2"
                    />
                  ) : null}
                  {option.label}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
