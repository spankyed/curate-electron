import { createActor, toPromise } from 'xstate';
import { createScrapeAndRankMachine } from './actors/scrape-rank-system';

import * as sharedRepository from '@services/core/repository';
import { updateWorkStatus } from '@services/core/status';
import scrapeArxivByDate from '@services/worker/scrape-rank/utils/scrape-arxiv-by-date';
import { DateStatuses } from '@services/core/types';

// Track active scraping processes
const activeScrapingProcesses = new Map<string, { actor: any; promise: Promise<any> }>();

export default {
  'scrape-date': scrapePapers,
  'cancel-scraping': cancelScraping,
};

async function scrapePapers(date) {
  runScrapeAndRank(date);

  return { message: 'Scraping started!' };
}

export async function cancelScraping(date) {
  const process = activeScrapingProcesses.get(date);
  if (process) {
    process.actor.stop();
    activeScrapingProcesses.delete(date);
    await sharedRepository.updateDate(date, { status: DateStatuses.PENDING });
    await sharedRepository.deletePapersByDate(date);
    updateWorkStatus({ key: date, status: DateStatuses.ERROR });
    // updateWorkStatus({ key: date, status: 'pending' });
    return { message: 'Scraping cancelled!' };
  }
  return { message: 'No active scraping process found!' };
}

export async function runScrapeAndRank(date, alwaysNotify = true) {
  const machine = createScrapeAndRankMachine({
    date,
    alwaysNotify,
    batchSize: 10,
    deps: {
      scrapeArxivByDate,
      sharedRepository,
      updateWorkStatus,
    },
  });

  const actor = createActor(machine);
  const promise = toPromise(actor);

  // Store the active process
  activeScrapingProcesses.set(date, { actor, promise });

  actor.start();

  try {
    const result = await promise;
    activeScrapingProcesses.delete(date);
    return result;
  } catch (error) {
    activeScrapingProcesses.delete(date);
    throw error;
  }
}
