export function safeDisplay(value: unknown): React.ReactNode {
  if (value == null) return "";
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return value.toString();
    default:
      return JSON.stringify(value);
  }
}
