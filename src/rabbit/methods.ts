/* eslint-disable @typescript-eslint/ban-types */

import { Channel } from "amqplib/callback_api";
import { CreateChannel, RabbitConnection } from ".";
import { Logger } from "../common";

const MethodsImp = async (
  channel: Channel,
  queue: string
): Promise<{
  publish: (message: IObjectLiteral) => boolean;
  receive: (handler: Function) => void;
}> => {
  const publish = (message: IObjectLiteral): boolean => {
    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  };

  const receive = (handler: Function) => {
    channel.consume(queue, (msg) => {
      if (msg) {
        channel.ack(msg);
        handler(msg.content.toString());
      }
      return null;
    });
  };

  return { publish, receive };
};

export const Methods = async (
  name: string,
  logger: Logger,
  server: string,
  errorHandler: Function,
  queue: string,
  channelName: string
): Promise<{
  publish: (message: IObjectLiteral) => boolean;
  receive: (handler: Function) => void;
}> => {
  const connection = await RabbitConnection({
    name,
    logger,
    server,
    errorHandler
  }).getInstance();

  const channel = await CreateChannel(
    connection,
    logger,
    errorHandler,
    queue,
    channelName
  );

  const { publish, receive } = await MethodsImp(channel, queue);

  return { publish, receive };
};
