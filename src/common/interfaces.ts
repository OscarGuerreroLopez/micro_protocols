export type LogType = "info" | "warn" | "error";

export type Logger = (logger: LogType, message: string, data?: unknown) => void;
export type ErrorHandler = (data: IObjectLiteral) => void;
export interface LoggerErrorHandlers {
  errorHandler: ErrorHandler;
  logger: Logger;
}
