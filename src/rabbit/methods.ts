/* eslint-disable @typescript-eslint/ban-types */

import { Channel } from "amqplib";
import { RabbitConnection } from "./connection";
import { CreateChannel } from "./channel";

import {
  RabbitImplementation,
  RabbitProtocols,
  RabbitParams
} from "./interfaces";

const MethodsImp = async (
  channel: Channel,
  queue: string
): Promise<RabbitImplementation> => {
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

export const RabbitMethods = async ({
  name,
  logger,
  server,
  errorHandler,
  queue,
  channelName
}: RabbitParams): Promise<RabbitProtocols> => {
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
