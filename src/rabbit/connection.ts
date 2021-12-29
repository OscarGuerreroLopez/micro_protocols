import amqp, { Connection } from "amqplib/callback_api";
import { RabbitConnection as RabbitConnectionParams } from "./interfaces";

export const RabbitConnection = ({
  name,
  logger,
  server,
  errorHandler
}: RabbitConnectionParams): Promise<Connection> => {
  const options = {
    clientProperties: {
      connection_name: name
    }
  };
  return new Promise((resolve, reject) => {
    amqp.connect(server, options, (error, connection) => {
      if (error) {
        logger("error", "Not able to connect to Rabbit", error);
        reject(error);
      }

      connection.on("error", (error) => {
        logger("error", "Rabbit connection error", error);
        errorHandler(error);
      });

      connection.on("close", () => {
        logger("info", "Rabbit connection closed");
      });

      logger("info", "Rabbit connection created");

      resolve(connection);
    });
  });
};
