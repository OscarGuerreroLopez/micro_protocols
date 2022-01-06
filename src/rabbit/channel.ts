/* eslint-disable @typescript-eslint/ban-types */
import { Channel, Connection } from "amqplib";
import { Logger } from "../common";

const channelInstances: Map<string, Readonly<Channel>> = new Map();

export const CreateChannel = async (
  connection: Connection,
  logger: Logger,
  errorHandler: (data: IObjectLiteral) => void,
  queue: string,
  channelName: string
): Promise<Channel> => {
  const channelInstance = channelInstances.get(channelName);

  if (channelInstance) {
    return channelInstance;
  }

  const channel = await connection.createChannel();

  channel.assertQueue(queue, {
    durable: true
  });

  channel.prefetch(1);

  channel.on("error", (error) => {
    channelInstances.delete(channelName);
    logger("error", "Rabbit channel error", error);
  });

  channel.on("close", () => {
    channelInstances.delete(channelName);
    logger("info", "Rabbit channel closed", { name: channelName });
    errorHandler({ message: "Channel closed", channelName });
  });

  logger("info", `Rabbit channel ${channelName} created  queue: ${queue}`);
  channelInstances.set(channelName, channel);

  return channel;
};
