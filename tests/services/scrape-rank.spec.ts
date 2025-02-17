/* eslint-disable @typescript-eslint/no-explicit-any */
import { createActor, fromPromise, toPromise } from 'xstate';
import { test, expect, vi } from 'vitest';
import { mockPaperRecords } from '../__mocks__/mock-papers'; // Import from __mocks__
import { createScrapeAndRankMachine } from '@services/worker/scrape-rank/actors/scrape-rank-system';
import { delay } from 'utils/delay';

vi.mock('node:child_process'); // Mock the child_process module globally using __mocks__/child_process.ts

test('Scrape-rank machine', async () => {
  console.log('here we go');

  const testMachine = createScrapeAndRankMachine('2025-01-15', false, {} as any).provide({
    actors: {
      scrapeArxivByDate: fromPromise(async () => delay(1000, mockPaperRecords)),
      storePapers: fromPromise(async () => Promise.resolve()),
    },
    actions: {
      setScrapingStatus: () => {},
      setRankingStatus: () => {},
      setCompleteStatus: () => {},
      setErrorStatus: () => {},
    }
  });

  const actor = createActor(testMachine);

  actor.start();

  const result = await toPromise(actor);
  console.log('result: ', result);

  expect(result).toBeTruthy();
});
