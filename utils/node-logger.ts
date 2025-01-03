import { createLogger, format, transports } from "winston";

// No-op logger for non-Node environments
const noopLogger = {
  info: () => {},
  error: () => {},
  warn: () => {},
};

const noopAction = () => {};

// Create the appropriate logger based on environment
const logger =
  typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge"
    ? createLogger({
        level: process.env.LOG_LEVEL || "info",
        format: format.combine(format.timestamp(), format.json()),
        transports: [
          new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
          }),
          new transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new transports.File({
            filename: "logs/combined.log",
          }),
        ],
      })
    : noopLogger;

export const logServerAction =
  typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge"
    ? (actionName: string, args: any[], result: any) => {
        logger.info("Server action executed", {
          action: actionName,
          arguments: args,
          result: result instanceof Error ? result.message : "success",
        });
      }
    : noopAction;

export const logDatabaseQuery =
  typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge"
    ? (query: string, params: any) => {
        logger.info("Database query executed", {
          query,
          params,
        });
      }
    : noopAction;

export default logger;
