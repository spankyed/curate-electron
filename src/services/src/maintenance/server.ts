import createServer from '../shared/server';
import { ports } from '../shared/constants';
import runBackgroundScripts from './background';
import controllers from './endpoints';


(async function start () {
  try {

    await runBackgroundScripts()
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
})();


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
