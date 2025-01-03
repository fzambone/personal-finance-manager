export interface FilterOption {
  label: string;
  value: string;
}

export interface DateRangeFilter {
  start: string;
  end: string;
}

export interface AmountRangeFilter {
  min: number;
  max: number;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "multiSelect" | "dateRange" | "amountRange";
  options?: FilterOption[];
}
