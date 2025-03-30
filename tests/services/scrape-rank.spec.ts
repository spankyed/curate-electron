/* eslint-disable @typescript-eslint/no-explicit-any */
import { createActor, toPromise } from 'xstate';
import { test, expect, vi } from 'vitest';
import { mockPaperRecords } from '../__mocks__/mock-papers';
// import { MockChildProcess } from '../__mocks__/child_process';
import { createScrapeAndRankMachine } from '@services/worker/scrape-rank/actors/scrape-rank-system';
import { delay } from 'utils/delay';

vi.mock('node:child_process');

test('Scrape-rank machine', async () => {
  const testMachine = createScrapeAndRankMachine({
    date: '2022-01-01',
    batchSize: 2, // ! max is 15 for the mock data
    alwaysNotify: false,
    deps: {
      scrapeArxivByDate: async () => delay(1000, mockPaperRecords),
      sharedRepository: {
        storePapers: () => Promise.resolve(),
        updateDate: () => Promise.resolve(),
      },
      updateWorkStatus: () => Promise.resolve(''),
    },
  }).provide({
    actions: {
      setScrapingStatus: () => {},
      setRankingStatus: () => {},
      setCompleteStatus: () => {},
      setErrorStatus: () => {},
    },
  });

  const actor = createActor(testMachine);

  actor.start();

  const result = await toPromise(actor);
  // console.log('result: ', result);

  expect(result).toBeTruthy();
});
