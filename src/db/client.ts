import { createClient } from "redis";

export async function createRedisClient(config) {
  const client = createClient({ url: `redis://${config.host}:${config.port}` });

  client.on("connect", function () {
    console.log("Connected!");
  });

  await client.connect();

  return client;
}

export async function storeData(client, key, value) {
  await client.set(key, value, function (err, reply) {
    console.log(reply); // OK
  });
}

export async function getData(client, key) {
  const reply = await client.get(key);
  return reply;
}
