/* eslint-disable @typescript-eslint/ban-types */
import { Message } from "kafkajs";

export interface ProducerImplementation {
  disconnect: () => Promise<void>;
  send: (messages: Message[], acks: number) => Promise<void>;
}

export type ConsumerImplementation = (
  groupId: string,
  handler: Function
) => Promise<void>;

export interface KafkaImplementation {
  producer: () => Promise<ProducerImplementation>;
  consumer: ConsumerImplementation;
}
