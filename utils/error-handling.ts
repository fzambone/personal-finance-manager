import { toast } from "react-hot-toast";
import { TransactionError } from "@/services/domain/errors";

type ErrorHandlerOptions = {
  defaultMessage: string;
  shouldReload?: boolean;
};

export function handleError(error: unknown, options: ErrorHandlerOptions) {
  console.error(options.defaultMessage, error);

  if (error instanceof TransactionError) {
    toast.error(error.message);
    return;
  }

  toast.error(options.defaultMessage);

  if (options.shouldReload) {
    window.location.reload();
  }
}
