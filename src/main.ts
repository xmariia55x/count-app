import createServer from "./app";
import config from "./config";
import { createRedisClient } from "./db/client";

async function start() {
  const { port } = config.app;
  const redis = await createRedisClient(config.redis);
  const application = createServer(redis);
  application.listen(port, () => {
    console.log(`App listening on ${port}`);
  });
}

start();
