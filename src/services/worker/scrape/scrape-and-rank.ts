// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw
// import * as fs from 'fs';
// import repository from './repository';
import * as sharedRepository from '@services/shared/repository';
import { updateWorkStatus } from '@services/shared/status';
// import { getRelevancyScores } from './relevancy-compute';
import scrapePapersByDate from './scrape-papers-by-date';
// import { getRelevancyScores } from './relevancy-compute';

import { Worker } from 'node:worker_threads';
import workerPath from './wrap-worker?modulePath';
// import createWorker from './wrap-worker?nodeWorker';

// Function to run getRelevancyScores in a worker thread
function runGetRelevancyScores(papers) {
  return new Promise((resolve, reject) => {
    console.log('workerPath: ', workerPath);
    const worker = new Worker(workerPath, {
      workerData: papers,
    });

    // const worker = createWorker({
    //   workerData: papers,
    // });

    worker.on('message', (message) => {
      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message);
      }
    });

    worker.on('error', (error) => {
      console.error('Worker error:', error);
      reject(error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

const scrapeAndRankPapers = async (date, alwaysNotify = true) => {
  try {
    console.log('Scraping papers...', date);
    sharedRepository.updateDate(date, { status: 'scraping' });
    updateWorkStatus({ key: date, status: 'scraping' }, alwaysNotify);

    const papers = await scrapePapersByDate(date);

    if (papers.length === 0) {
      throw new Error('No papers found after scraping');
    }

    console.log('Ranking papers...', date);
    sharedRepository.updateDate(date, { status: 'ranking' });
    updateWorkStatus({ key: date, status: 'ranking' }, alwaysNotify);

    // Use the worker thread for getRelevancyScores
    const rankedPapers = await runGetRelevancyScores(papers);
    const paperRecords = rankedPapers.sort((a, b) => b.relevancy - a.relevancy);

    console.log('Storing papers in DB...', date);

    try {
      // await Promise.all([
      //   sharedRepository.storePapers(paperRecords),
      //   sharedRepository.updateDate(date, { status: 'complete', count: paperRecords.length }),
      // ]);
    } catch (error) {
      console.error(`Error storing papers: ${date}`, error);
      throw error;
    }

    updateWorkStatus(
      { key: date, status: 'complete', data: paperRecords, final: true },
      alwaysNotify
    );

    console.log('Scraped, ranked, and stored papers for:', date);

    return paperRecords;
  } catch (error) {
    console.error(`Error scraping/ranking papers for [${date}]:`, error?.message);
    sharedRepository.updateDate(date, { status: 'pending' });
    updateWorkStatus({ key: date, status: 'error', data: [], final: true }, alwaysNotify);
    return [];
  }
};


// const scrapeAndRankPapers = async (date: string, alwaysNotify = true) => {
//   try {
//     console.log('Scraping papers...', date);
//     sharedRepository.updateDate(date, { status: 'scraping' });
//     updateWorkStatus({ key: date, status: 'scraping' }, alwaysNotify);

//     const papers = await scrapePapersByDate(date);

//     if (papers.length === 0) {
//       throw new Error('No papers found after scraping');
//     }

//     console.log('Ranking papers...', date);
//     sharedRepository.updateDate(date, { status: 'ranking' });
//     updateWorkStatus({ key: date, status: 'ranking' }, alwaysNotify);

//     const rankedPapers = await getRelevancyScores(papers);
//     const paperRecords = rankedPapers.sort((a, b) => b.relevancy - a.relevancy);

//     console.log('Storing papers in DB...', date);

//     try {
//       Promise.all([
//         sharedRepository.storePapers(paperRecords),
//         sharedRepository.updateDate(date, { status: 'complete', count: paperRecords.length }),
//       ]);
//     } catch (error) {
//       console.error(`Error storing papers: ${date}`, error);

//       throw error;
//     }

//     updateWorkStatus(
//       { key: date, status: 'complete', data: paperRecords, final: true },
//       alwaysNotify
//     );

//     console.log('Scraped, ranked, and stored papers for:', date);

//     return paperRecords;
//   } catch (error: any) {
//     console.error(`Error scraping/ranking papers for [${date}]:`, error?.message);

//     // sharedRepository.updateDate(date, 'error')
//     sharedRepository.updateDate(date, { status: 'pending' });
//     updateWorkStatus({ key: date, status: 'error', data: [], final: true }, alwaysNotify);

//     // throw error
//     return [];
//   }
// };

export default scrapeAndRankPapers;
