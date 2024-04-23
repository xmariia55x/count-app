import { createClient } from "redis";

export async function createRedisClient(config) {
  const client = createClient({ url: `redis://${config.host}:${config.port}` });

  client.on("connect", function () {
    console.log("Connected!");
  });

  await client.connect();

  return client;
}

export default class RedisClient {
  private redisClient: any;

  constructor(dbClient) {
    this.redisClient = dbClient;
  }

  async storeData(key, value) {
    await this.redisClient.set(key, value, function (err, reply) {
      console.log(reply); // OK
    });
  }

  async getData(key) {
    const reply = await this.redisClient.get(key);
    return reply;
  }
}
