export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class TransactionError extends AppError {
  constructor(message: string, code?: string, cause?: unknown) {
    super(message, code, cause);
    this.name = "TransactionError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string, cause?: unknown) {
    super(message, code, cause);
    this.name = "ValidationError";
  }
}
