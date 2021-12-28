import { connect, NatsConnection } from "nats";
import { NatsConOptions, NatsParams } from "./interfaces";

let instance: NatsConnection;

export const NatsConnect = ({
  servers,
  token,
  logger
}: NatsConOptions): NatsParams => {
  const createInstance = async () => {
    const nc = await connect({
      servers,
      maxPingOut: 4,
      maxReconnectAttempts: 60,
      reconnectTimeWait: 5 * 1000, // 5s
      token
    });
    logger("info", "nats instance created", servers);

    return nc;
  };

  return {
    getInstance: async (): Promise<NatsConnection> => {
      if (!instance) {
        instance = await createInstance();
      }

      return instance;
    }
  };
};
