import amqp, { Connection } from "amqplib";
import { RabbitConnectionParams } from "./interfaces";

let connectionInstance: Connection;

export const RabbitConnection = ({
  name,
  logger,
  server,
  errorHandler
}: RabbitConnectionParams): {
  getInstance: () => Promise<Connection>;
} => {
  const createInstance = async (): Promise<Connection> => {
    const options = {
      clientProperties: {
        connection_name: name
      }
    };

    const connection = await amqp.connect(server, options);

    connection.on("error", (error) => {
      logger("error", "Rabbit connection error", error);
      errorHandler(error);
    });

    connection.on("close", () => {
      logger("info", "Rabbit connection closed");
      errorHandler("Connection closed");
    });

    logger("info", `Rabbit connection created ${name}`);
    return connection;
  };

  return {
    getInstance: async (): Promise<Connection> => {
      if (!connectionInstance) {
        connectionInstance = await createInstance();
      }
      return connectionInstance;
    }
  };
};
