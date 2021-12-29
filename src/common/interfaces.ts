export type LogType = "info" | "warn" | "error";

export type Logger = (logger: LogType, message: string, data?: unknown) => void;
