import { createLogger, format, transports } from "winston";

// Custom format for development
const devFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "HH:mm:ss" }),
  format.printf(({ level, message, timestamp, ...metadata }) => {
    const meta = Object.keys(metadata).length
      ? `\n${JSON.stringify(metadata, null, 2)}`
      : "";
    return `${timestamp} ${level}: ${message}${meta}`;
  })
);

// No-op logger for non-Node environments
const noopLogger = {
  info: () => {},
  error: () => {},
  warn: () => {},
};

const logger =
  typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge"
    ? createLogger({
        level: process.env.LOG_LEVEL || "info",
        format:
          process.env.NODE_ENV === "development" ? devFormat : format.json(),
        transports: [
          new transports.Console({
            level: process.env.NODE_ENV === "development" ? "info" : "error",
            // Only log errors and important info in development
            format: format.combine(format.colorize(), format.simple()),
          }),
          // File transport only for errors
          new transports.File({
            filename: "logs/error.log",
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ],
        // Silence certain logs in development
        silent:
          process.env.NODE_ENV === "development" &&
          process.env.DISABLE_LOGGING === "true",
      })
    : noopLogger;

export const logServerAction =
  typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge"
    ? (actionName: string, args: any[], result: any) => {
        // Only log errors and important actions in development
        if (process.env.NODE_ENV === "development") {
          if (result instanceof Error) {
            logger.error(`Server Action Error: ${actionName}`, {
              error: result.message,
              args,
            });
          }
          // Skip successful action logging in development unless explicitly enabled
          else if (process.env.LOG_ACTIONS === "true") {
            logger.info(`Server Action: ${actionName}`);
          }
        }
      }
    : () => {};

export const logDatabaseQuery =
  typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge"
    ? (query: string, params: any) => {
        // Only log slow queries in development
        if (process.env.NODE_ENV === "development" && params.duration > 100) {
          logger.warn(`Slow Query: ${query}`, {
            duration: `${params.duration}ms`,
            ...params,
          });
        }
      }
    : () => {};

export default logger;
