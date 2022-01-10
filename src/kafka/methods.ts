/* eslint-disable @typescript-eslint/ban-types */
import { Message } from "kafkajs";
import { KafkaConnection } from "./connection";
import { KafkaImplementation, ProducerImplementation } from "./interfaces";

export const KafkaMethods = (
  clientId: string,
  brokers: string[],
  topic: string
): KafkaImplementation => {
  const kafkaConnection = KafkaConnection(clientId, brokers).getInstance();

  const producer = async (): Promise<ProducerImplementation> => {
    const producer = kafkaConnection.producer();

    await producer.connect();

    const disconnect = async () => {
      await producer.disconnect();
    };

    const send = async (messages: Message[], acks: number) => {
      await producer.send({
        topic,
        messages,
        acks
      });
    };

    return { disconnect, send };
  };

  const consumer = async (
    groupId: string,
    handler: Function
  ): Promise<void> => {
    const consumer = kafkaConnection.consumer({ groupId });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        handler(message);
      }
    });
  };

  return { producer, consumer };
};
