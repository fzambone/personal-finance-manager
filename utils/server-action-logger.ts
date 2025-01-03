import { logServerAction } from "./node-logger";

export function withLogging<T extends (...args: any[]) => Promise<any>>(
  actionName: string,
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      const result = await fn(...args);
      logServerAction(actionName, args, result);
      return result;
    } catch (error) {
      logServerAction(actionName, args, error);
      throw error;
    }
  }) as T;
}
