/* eslint-disable @typescript-eslint/ban-types */
import { Logger } from "../common";

export interface RabbitConnectionParams {
  name: string;
  logger: Logger;
  server: string;
  errorHandler: Function;
}
