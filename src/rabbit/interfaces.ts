/* eslint-disable @typescript-eslint/ban-types */
import { LoggerErrorHandlers } from "../common";

export interface RabbitConnectionParams {
  name: string;
  server: string;
  loggerErrorHandlers: LoggerErrorHandlers;
}

export interface RabbitProtocols {
  publish: (message: IObjectLiteral) => boolean;
  receive: (handler: Function) => void;
}

export interface RabbitParams {
  connectionName: string;
  rabbitServer: string;
  loggerErrorHandlers: LoggerErrorHandlers;
  queue: string;
  channelName: string;
}
