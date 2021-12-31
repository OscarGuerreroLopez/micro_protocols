/* eslint-disable @typescript-eslint/ban-types */
import { Channel, Connection } from "amqplib";
import { Logger } from "../common";

// let channelInstance: Channel;
const channelInstances: Map<string, Readonly<Channel>> = new Map();

export const CreateChannel = async (
  connection: Connection,
  logger: Logger,
  errorHandler: Function,
  queue: string,
  channelName: string
): Promise<Channel> => {
  const channelInstance = channelInstances.get(channelName);

  if (channelInstance) {
    logger("info", `Reusing Rabbit channel ${channelName} queue: ${queue}`);
    return channelInstance;
  }

  const channel = await connection.createChannel();

  channel.assertQueue(queue, {
    durable: true
  });

  channel.prefetch(1);

  channel.on("error", (error) => {
    logger("error", "Rabbit channel error", error);
  });

  channel.on("close", () => {
    logger("info", "Rabbit channel closed");
    errorHandler("Channel closed");
  });

  logger("info", `Rabbit channel ${channelName} created  queue: ${queue}`);
  channelInstances.set(channelName, channel);

  return channel;
};
