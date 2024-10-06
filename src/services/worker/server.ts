import Hapi from '@hapi/hapi';
import { ports } from '../shared/constants';
import createServer from '../shared/server';
import routes from './endpoints';
// import setup from './service/setup';

const serverConfig: Hapi.ServerOptions | undefined = { port: ports.worker };

(async function start () {
  const server = createServer(serverConfig, routes);

  try {
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Worker service running at:', server.info.uri);
})();


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
