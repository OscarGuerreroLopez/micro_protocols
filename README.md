# Micro connections

This is just a library to handle the connections for microservices

## Installation

```bash
npm install micro_protocols
```

## NATS Usage

```
import { Methods, LogType } from "oscar_nats";

// you can inject any logger as longs as it meets the LogType
const logger = (logger: LogType, message: string, data?: unknown) => {
  if (logger === "info") {
    console.log("@@@info", message, data);
  }

  if (logger === "warn") {
    console.log("@@@warn", message, data);
  }

  if (logger === "error") {
    console.log("@@@error", message, data);
  }
};

export const BusMethods = Methods(
  SERVERS,
  TOKEN,
  logger
);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
