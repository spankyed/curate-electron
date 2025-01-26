import { createActor } from 'xstate';
import { createScrapeAndRankMachine } from './actors/system';
import type { PaperRecord } from '@services/shared/types';

export default {
  'scrape-date': scrapePapers,
};

async function scrapePapers(date) {
  runScrapeAndRank(date);

  return { message: 'Scraping started!' };
}

export async function runScrapeAndRank(date, alwaysNotify = true): Promise<PaperRecord[]> {
  return new Promise((resolve, reject) => {
    const machine = createScrapeAndRankMachine(date, alwaysNotify);
    const actor = createActor(machine);

    actor.subscribe({
      next: (state) => {
        if (state.status === 'done') {
          if (state.value === 'Handle success') {
            resolve(state.context.rankedPapers);
          } else if (state.value === 'Handle error') {
            reject(state.context.error);
          }
        }
      },
      error: (error) => {
        // If something goes unhandled
        reject(error);
      },
      complete: () => {
        // Called when the actor is stopped or completed
        // In many cases, you can handle finalization in `next` => `state.done`.
      },
    });

    actor.start();
  });
}
