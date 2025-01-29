import { createActor, toPromise } from 'xstate';
import { createScrapeAndRankMachine } from './actors/system';

export default {
  'scrape-date': scrapePapers,
};

async function scrapePapers(date) {
  runScrapeAndRank(date);

  return { message: 'Scraping started!' };
}

export async function runScrapeAndRank(date, alwaysNotify = true) {
  const machine = createScrapeAndRankMachine(date, alwaysNotify);
  const actor = createActor(machine);
  actor.start();

  return toPromise(actor);
}
