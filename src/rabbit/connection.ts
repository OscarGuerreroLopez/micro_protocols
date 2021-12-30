import amqp, { Connection } from "amqplib/callback_api";
import { RabbitConnectionParams } from "./interfaces";

// export const RabbitConnection = ({
//   name,
//   logger,
//   server,
//   errorHandler
// }: RabbitConnectionParams): Promise<Connection> => {
//   const options = {
//     clientProperties: {
//       connection_name: name
//     }
//   };
//   return new Promise((resolve, reject) => {
//     console.log("@@@111", name, connectionInstance);

//     if (connectionInstance) {
//       resolve(connectionInstance);
//     }
//     amqp.connect(server, options, (error, connection) => {
//       if (error) {
//         logger("error", "Not able to connect to Rabbit", error);
//         reject(error);
//       }

//       connection.on("error", (error) => {
//         logger("error", "Rabbit connection error", error);
//         errorHandler(error);
//       });

//       connection.on("close", () => {
//         logger("info", "Rabbit connection closed");
//         errorHandler("Connection closed");
//       });

//       logger("info", `Rabbit connection created ${name}`);

//       connectionInstance = connection;

//       resolve(connectionInstance);
//     });
//   });
// };

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
    return new Promise((resolve, reject) => {
      const options = {
        clientProperties: {
          connection_name: name
        }
      };
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
          errorHandler("Connection closed");
        });

        logger("info", `Rabbit connection created ${name}`);

        resolve(connection);
      });
    });
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
