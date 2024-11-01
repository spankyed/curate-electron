// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw
// import * as fs from 'fs';
// import repository from './repository';

import path from 'node:path';
import { fork } from 'node:child_process';

export default function spawnRankingProcess(papers) {
  return new Promise((resolve, reject) => {
    const childPath = path.resolve(__dirname, 'ranking-process.js');

    const child = fork(childPath, ['child']);
    // const child = fork(childPath, [], {
    //   stdio: ['inherit', 'inherit', 'inherit', 'ipc'], // Ensure IPC is enabled
    // });

    child.on('message', (data) => {
      // console.log('data from child: ', data);
      if (data.ready) {
        // Child is ready, send the papers data
        child.send(papers);
      } else if (data.rankedPapers) {
        resolve(data.rankedPapers);
        child.kill();
      } else if (data.error) {
        reject(new Error(data.error));
        child.kill();
      }
    });

    child.on('error', (error) => {
      console.error('Child process error:', error);
      reject(error);
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });
  });
}
