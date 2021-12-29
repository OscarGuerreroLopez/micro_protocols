/* eslint-disable @typescript-eslint/ban-types */

import { Connection, Channel } from "amqplib/callback_api";
import { Logger } from "../common";
import { RabbitConnection } from "./connection";

let connectionInstance: Connection;
let channelInstance: Channel;

export const CreateChannel = async (
  name: string,
  server: string,
  logger: Logger,
  errorHandler: Function,
  queue: string
): Promise<void> => {
  if (!connectionInstance) {
    connectionInstance = await RabbitConnection({
      name,
      logger,
      server,
      errorHandler
    });
  }

  return new Promise((resolve, reject) => {
    connectionInstance.createChannel((err, channel) => {
      if (err) {
        logger("error", "Not able to connect to Rabbit", err);
        reject(err);
      }

      channel.assertQueue(queue, {
        durable: true
      });

      channel.prefetch(1);

      channel.on("error", (error) => {
        logger("error", "Rabbit channel error", error);
      });

      channel.on("close", () => {
        logger("info", "Raabit channel closed");
      });
      channelInstance = channel;

      resolve();
    });
  });
};

export const Methods = async (
  name: string,
  server: string,
  logger: Logger,
  errorHandler: Function,
  queue: string
): Promise<{
  publish: (message: IObjectLiteral) => boolean;
  receive: (queue: string, handler: Function) => void;
}> => {
  if (!channelInstance) {
    await CreateChannel(name, server, logger, errorHandler, queue);
  }

  const publish = (message: IObjectLiteral): boolean => {
    return channelInstance.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message))
    );
  };

  const receive = (queue: string, handler: Function) => {
    channelInstance.consume(queue, (msg) => {
      if (msg) {
        channelInstance.ack(msg);
        handler(msg.content.toString());
      }
      return null;
    });
  };

  return { publish, receive };
};
