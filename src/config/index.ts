const apiPort = process.env.API_PORT ?? 4000;

export default {
  app: {
    port: typeof apiPort === 'string' ? Number(apiPort) : apiPort,
  },
};
