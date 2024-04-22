const apiPort = process.env.API_PORT ?? 4000;
const redisPort = process.env.REDIS_PORT ?? 6379;

export default {
  app: {
    port: typeof apiPort === 'string' ? Number(apiPort) : apiPort,
  },
  file: process.env.FILE_NAME ?? 'data.json',
  redis: {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: typeof redisPort === 'string' ? Number(redisPort) : redisPort
  }
};
