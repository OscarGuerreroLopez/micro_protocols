/* eslint-disable @typescript-eslint/ban-types */
import { createInbox, JSONCodec, Subscription } from "nats";
import { NatsConnect } from "./connection";
import { Logger, Protocols } from "./interfaces";

const jc = JSONCodec();
const inbox = createInbox();

export const Methods = async (
  hosts: string,
  token: string,
  logger: Logger
): Promise<Protocols> => {
  const servers = hosts.split(",");

  const connection = await NatsConnect({
    servers,
    token,
    logger
  }).getInstance();

  const publish = async (route: string, data: unknown): Promise<void> => {
    connection.publish(route, jc.encode(data), {
      reply: inbox
    });
  };

  const subscribe = async (
    subject: string,
    handler: Function
  ): Promise<Subscription> => {
    const subscription = connection.subscribe(subject, {
      callback: async (err, msg) => {
        if (err) {
          logger("error", `Error on subscription for ${subject}`, err);
        } else if (msg.headers?.hasError) {
          logger(
            "error",
            `Something is going on with the subscriber for ${subject}`,
            JSON.stringify(msg.headers)
          );
        } else {
          const data = jc.decode(msg.data);

          msg.respond(jc.encode(await handler(data)));
        }
      }
    });

    return subscription;
  };

  const request = async <T, V>(subject: string, data: T): Promise<V> => {
    const result = await connection.request(subject, jc.encode(data), {
      timeout: 2000
    });

    return jc.decode(result.data) as V;
  };

  const close = async () => {
    await connection.close();
  };

  const flush = async () => {
    await connection.flush();
    const start = Date.now();

    logger("info", `round trip completed in, ${Date.now() - start}, "ms`);
  };

  await subscribe(inbox, (data: unknown) => {
    logger("info", "@@@inbox", data);
  });

  return {
    publish,
    subscribe,
    request,
    close,
    flush
  };
};
