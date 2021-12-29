/* eslint-disable @typescript-eslint/ban-types */

import { NatsConnection, Subscription } from "nats";
import { Logger } from "../common";

export interface NatsConOptions {
  servers: string[];
  token: string;
  logger: Logger;
}

export interface Protocols {
  publish: (route: string, data: unknown) => Promise<void>;
  subscribe: (subject: string, handler: Function) => Promise<Subscription>;
  request: <T, V>(subject: string, data: T) => Promise<V>;
  close: () => void;
  flush: () => void;
}

export interface NatsParams {
  getInstance: () => Promise<NatsConnection>;
}
