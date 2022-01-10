import { Kafka } from "kafkajs";

let instance: Kafka;

// export const KafkaConnection = (clientId: string, brokers: string[]): Kafka => {
//   const kafka = new Kafka({
//     clientId,
//     brokers
//   });

//   return kafka;
// };

export const KafkaConnection = (
  clientId: string,
  brokers: string[]
): {
  getInstance: () => Kafka;
} => {
  const createInstance = () => {
    const kafka = new Kafka({
      clientId,
      brokers
    });

    return kafka;
  };

  return {
    getInstance: () => {
      if (!instance) {
        console.log("@@@111 Creating Connection");

        instance = createInstance();
      }
      return instance;
    }
  };
};
