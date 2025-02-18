/* eslint-disable @typescript-eslint/no-explicit-any */
import { createActor, toPromise } from 'xstate';
import { test, expect, vi } from 'vitest';
import { mockPaperRecords } from '../__mocks__/mock-papers'; // Import from __mocks__
import { MockChildProcess } from '../__mocks__/child_process'; // Import from __mocks__
import { createScrapeAndRankMachine } from '@services/worker/scrape-rank/actors/scrape-rank-system';
import { delay } from 'utils/delay';

vi.mock('node:child_process', () => {
  return {
    fork: vi.fn((scriptPath: string, args: string[]) => {
      const isRankComputer = scriptPath.endsWith('child-process.js');

      if (isRankComputer && args.includes('child')) {
        const child = new MockChildProcess();

        setTimeout(() => {
          child.emit('message', { type: 'PROC.READY' });
        }, 10);

        return child;
      }

      throw new Error(`Unexpected fork call with scriptPath: ${scriptPath}`);
    }),
  };
});

test('Scrape-rank machine', async () => {
  const testBatchSize = 10; // ! max is 15 for the mock data

  const testMachine = createScrapeAndRankMachine({
    date: '2022-01-01',
    batchSize: testBatchSize,
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
    }
  });

  const actor = createActor(testMachine);

  actor.start();

  const result = await toPromise(actor);
  console.log('result: ', result);

  expect(result).toBeTruthy();
});
