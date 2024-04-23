import createServer from "./app";
import config from "./config";
import RedisClient, { createRedisClient } from "./db/client";

async function start() {
  const { port } = config.app;
  const redisInstance = await createRedisClient(config.redis);
  const redisClient = new RedisClient(redisInstance);
  const application = createServer(redisClient);
  application.listen(port, () => {
    console.log(`App listening on ${port}`);
  });
}

start();
