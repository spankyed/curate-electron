import { createActor, toPromise } from 'xstate';
import { createScrapeAndRankMachine } from './actors/scrape-rank-system';

import * as sharedRepository from '@services/shared/repository';
import { updateWorkStatus } from '@services/shared/status';
import scrapeArxivByDate from '@services/worker/scrape-rank/utils/scrape-arxiv-by-date';

export default {
  'scrape-date': scrapePapers,
};

async function scrapePapers(date) {
  runScrapeAndRank(date);

  return { message: 'Scraping started!' };
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
  actor.start();

  return toPromise(actor);
}
