/* eslint-disable @typescript-eslint/ban-types */
import { Logger } from "../common";

export interface RabbitConnection {
  name: string;
  logger: Logger;
  server: string;
  errorHandler: Function;
}
