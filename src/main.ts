import createServer from './app';
import config from './config';

async function start() {
  const { port } = config.app;
  const application = createServer();
  application.listen(port, () => {console.log(`App listening on ${port}`)});
}

start();
