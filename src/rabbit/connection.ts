import amqp, { Connection } from "amqplib";
import { RabbitConnectionParams } from "./interfaces";

let connectionInstance: Connection;
let connectionActived = false;

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
      connectionActived = false;
      errorHandler(error);
    });

    connection.on("close", () => {
      logger("info", "Rabbit connection closed", { name });
      connectionActived = false;
      errorHandler({ message: "Connection closed", name });
    });

    logger("info", `Rabbit connection created ${name}`);
    connectionActived = true;
    return connection;
  };

  return {
    getInstance: async (): Promise<Connection> => {
      if (!connectionActived || !connectionInstance) {
        connectionInstance = await createInstance();
      }
      return connectionInstance;
    }
  };
};
