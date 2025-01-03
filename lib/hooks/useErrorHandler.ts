import { useState, useCallback } from "react";
import { handleError } from "../errors/handler";
import type { ErrorHandlerOptions } from "../errors/handler";

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  const handleErrorWithState = useCallback(
    (error: unknown, options?: ErrorHandlerOptions) => {
      const message = handleError(error, options);
      setError(message);
      return message;
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError: handleErrorWithState,
    clearError,
  };
}
