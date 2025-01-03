import { toast } from "react-hot-toast";
import { AppError, TransactionError, ValidationError } from "./types";

export type ErrorHandlerOptions = {
  defaultMessage?: string;
  shouldReload?: boolean;
  showToast?: boolean;
  logError?: boolean;
};

const DEFAULT_OPTIONS: ErrorHandlerOptions = {
  defaultMessage: "An unexpected error occurred",
  shouldReload: false,
  showToast: true,
  logError: true,
};

export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const message =
    error instanceof AppError ? error.message : opts.defaultMessage;

  if (opts.logError) {
    console.error(message, error);
  }

  if (opts.showToast) {
    toast.error(message);
  }

  if (opts.shouldReload) {
    window.location.reload();
  }

  return message || "An unexpected error occurred";
}
