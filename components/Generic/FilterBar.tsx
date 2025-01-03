"use client";

import { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import FilterTag from "./FilterTag";
import { FilterOption } from "@/app/types/filters";

interface DateRange {
  start: string;
  end: string;
}

interface AmountRange {
  min: number;
  max: number;
}

export interface FilterState {
  search?: string;
  dateRange?: DateRange;
  amountRange?: AmountRange;
  types?: string[];
  categories?: string[];
  paymentMethods?: string[];
  statuses?: string[];
}

interface FilterBarProps {
  formOptions: {
    types: FilterOption[];
    categories: FilterOption[];
    paymentMethods: FilterOption[];
  };
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterBar({
  formOptions,
  onFilterChange,
}: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [searchValue, setSearchValue] = useState("");

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("search", searchValue);
  };

  const handleRemoveFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <FilterDropdown
          label="Date Range"
          type="dateRange"
          value={filters.dateRange}
          onChange={(value) => handleFilterChange("dateRange", value)}
        />

        <FilterDropdown
          label="Amount Range"
          type="amountRange"
          value={filters.amountRange}
          onChange={(value) => handleFilterChange("amountRange", value)}
        />

        <FilterDropdown
          label="Type"
          options={formOptions.types}
          value={filters.types}
          onChange={(value) => handleFilterChange("types", value)}
          multiSelect
        />

        <FilterDropdown
          label="Category"
          options={formOptions.categories}
          value={filters.categories}
          onChange={(value) => handleFilterChange("categories", value)}
          multiSelect
        />

        <FilterDropdown
          label="Payment Method"
          options={formOptions.paymentMethods}
          value={filters.paymentMethods}
          onChange={(value) => handleFilterChange("paymentMethods", value)}
          multiSelect
        />

        <FilterDropdown
          label="Status"
          options={[
            { label: "Completed", value: "completed" },
            { label: "Pending", value: "pending" },
            { label: "Failed", value: "failed" },
          ]}
          value={filters.statuses}
          onChange={(value) => handleFilterChange("statuses", value)}
          multiSelect
        />
      </div>

      {/* Active filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (!value || (Array.isArray(value) && value.length === 0))
            return null;
          return (
            <FilterTag
              key={key}
              label={key}
              value={value}
              onRemove={() => handleRemoveFilter(key as keyof FilterState)}
            />
          );
        })}
      </div>
    </div>
  );
}
