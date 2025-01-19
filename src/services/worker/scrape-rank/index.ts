import { createActor } from 'xstate';
import { createScrapeAndRankMachine } from './state-machine';
import type { PaperRecord } from '@services/shared/types';

async function scrapePapers(date) {
  runScrapeAndRank(date);

  return { message: 'Scraping started!' };
}

export default {
  'scrape-date': scrapePapers,
};

export async function runScrapeAndRank(date, alwaysNotify = true): Promise<PaperRecord[]> {
  return new Promise((resolve, reject) => {
    const machine = createScrapeAndRankMachine(date, alwaysNotify);
    const actor = createActor(machine);

    // Subscribe to state changes
    actor.subscribe({
      next: (state) => {
        // If the machine reaches a final state (success or handleError)
        if (state.status === 'done') {
          // If successful
          if (state.value === 'Handle success') {
            resolve(state.context.rankedPapers);
          } else if (state.value === 'Handle error') {
            // Or handle final error state
            // You could also resolve([]) or do something else
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

    // Finally, start the actor
    actor.start();
  });
}
