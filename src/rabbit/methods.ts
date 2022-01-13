/* eslint-disable @typescript-eslint/ban-types */

import { RabbitConnection } from "./connection";
import { CreateChannel } from "./channel";

import { RabbitProtocols, RabbitParams } from "./interfaces";

export const RabbitMethods = async ({
  connectionName,
  rabbitServer,
  loggerErrorHandlers,
  queue,
  channelName
}: RabbitParams): Promise<RabbitProtocols> => {
  const connection = await RabbitConnection({
    name: connectionName,
    server: rabbitServer,
    loggerErrorHandlers
  }).getInstance();

  const channel = await CreateChannel(
    connection,
    queue,
    channelName,
    loggerErrorHandlers
  );

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
