/* eslint-disable @typescript-eslint/ban-types */

import { Channel } from "amqplib/callback_api";

export const Methods = async (
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
