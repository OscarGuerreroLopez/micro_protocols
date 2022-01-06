/* eslint-disable @typescript-eslint/ban-types */
import { Logger } from "../common";

export interface RabbitConnectionParams {
  name: string;
  logger: Logger;
  server: string;
  errorHandler: (data: IObjectLiteral) => void;
}

export interface RabbitImplementation {
  publish: (message: IObjectLiteral) => boolean;
  receive: (handler: Function) => void;
}

export interface RabbitProtocols {
  publish: (message: IObjectLiteral) => boolean;
  receive: (handler: Function) => void;
}

export interface RabbitParams {
  name: string;
  logger: Logger;
  server: string;
  errorHandler: (data: IObjectLiteral) => void;
  queue: string;
  channelName: string;
}
