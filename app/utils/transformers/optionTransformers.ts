type Option = {
  id: string;
  name: string;
};

type SelectOption = {
  label: string;
  value: string;
};

export const toSelectOptions = (items: Option[]): SelectOption[] => {
  return items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
};

export const findOptionLabel = (
  options: SelectOption[],
  value: string
): string => {
  return options.find((opt) => opt.value === value)?.label || "";
};

export const findOptionLabelRequired = (
  options: SelectOption[],
  value: string,
  errorMessage: string = "Option not found"
): string => {
  const label = findOptionLabel(options, value);
  if (!label) throw new Error(errorMessage);
  return label;
};
