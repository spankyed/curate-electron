// getRelevancyScoresWorker.js
// Import or define getRelevancyScores function here

import { parentPort, workerData } from 'node:worker_threads';
import { getRelevancyScores } from './relevancy-compute';

const port = parentPort;
if (!port) throw new Error('IllegalState');

port.on('message', () => {
  port.postMessage(`hello ${workerData}`);
});

// try {
//   const papers = workerData;
//   const rankedPapers = await getRelevancyScores(papers);
//   parentPort?.postMessage(rankedPapers);
// } catch (error) {
//   parentPort?.postMessage({ error: error.message });
// }

(async () => {
  try {
    const papers = workerData;
    const rankedPapers = await getRelevancyScores(papers);
    parentPort?.postMessage(rankedPapers);
  } catch (error) {
    parentPort?.postMessage({ error: error.message });
  }
})();
