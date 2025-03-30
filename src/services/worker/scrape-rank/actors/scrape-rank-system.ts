/* eslint-disable @typescript-eslint/no-explicit-any */
import { assign, type ErrorActorEvent, fromPromise, setup, log } from 'xstate';
import { DateStatuses, type PaperRecord } from '@services/shared/types';
import { createProcessManagerActor } from './process-manager';

export interface ScrapeAndRankDependencies {
  scrapeArxivByDate: (date: string) => Promise<PaperRecord[]>;
  sharedRepository: any;
  updateWorkStatus: (statusData: any, alwaysNotify: boolean) => Promise<string>;
}
type Config = {
  date: string;
  batchSize: number;
  alwaysNotify: boolean;
  deps: ScrapeAndRankDependencies;
};
export const createScrapeAndRankMachine = (config: Config) => {
  const { date, batchSize, alwaysNotify, deps } = config;
  return setup({
    types: {} as {
      context: {
        date: string;
        alwaysNotify: boolean;
        papers: PaperRecord[];
        rankedPapers: PaperRecord[];
        error: ErrorActorEvent['error'];
      };
      output: PaperRecord[];
    },
    actors: {
      scrapeArxivByDate: fromPromise(async ({ input }: { input: { date: string } }) => {
        return deps.scrapeArxivByDate(input.date);
      }),
      spawnRankingProcess: createProcessManagerActor(batchSize),
      storePapers: fromPromise(async ({ input }: { input: { rankedPapers: PaperRecord[] } }) => {
        const { rankedPapers } = input;

        await Promise.all([
          deps.sharedRepository.storePapers(rankedPapers),
          deps.sharedRepository.updateDate(date, {
            status: DateStatuses.COMPLETE,
            count: rankedPapers.length,
          }),
        ]);
      }),
    },
    actions: {
      logError: ({ context }) =>
        console.error(
          `_Error scraping/ranking papers for [${context.date}]:`,
          (context.error as { message: string })?.message
        ),
      setScrapingStatus: ({ context }) => {
        deps.sharedRepository.updateDate(context.date, { status: DateStatuses.SCRAPING });
        deps.updateWorkStatus(
          { key: context.date, status: DateStatuses.SCRAPING },
          context.alwaysNotify
        );
      },
      setRankingStatus: ({ context }) => {
        deps.sharedRepository.updateDate(context.date, { status: DateStatuses.RANKING });
        deps.updateWorkStatus(
          { key: context.date, status: DateStatuses.RANKING },
          context.alwaysNotify
        );
      },
      setCompleteStatus: ({ context }) => {
        deps.updateWorkStatus(
          {
            key: context.date,
            status: DateStatuses.COMPLETE,
            data: context.rankedPapers,
            final: true,
          },
          context.alwaysNotify
        );
      },
      setErrorStatus: ({ context }) => {
        deps.sharedRepository.updateDate(context.date, { status: DateStatuses.PENDING });
        deps.updateWorkStatus(
          { key: context.date, status: DateStatuses.ERROR, data: [], final: true },
          context.alwaysNotify
        );
      },
    },
  }).createMachine({
    id: 'scrape-and-rank-system',
    initial: 'Scrape arxiv by date',
    context: {
      date,
      alwaysNotify,
      papers: [],
      rankedPapers: [],
      error: null,
    },
    states: {
      'Scrape arxiv by date': {
        entry: [log(`- Scraping papers: ${date}`), 'setScrapingStatus'],
        invoke: {
          src: 'scrapeArxivByDate',
          input: ({ context }) => ({ date: context.date }),
          onDone: {
            target: 'Check if papers were found',
            actions: assign({
              papers: ({ event }) => event.output,
            }),
          },
          onError: {
            target: 'Handle error',
            actions: assign({
              error: ({ event }) => event.error,
            }),
          },
        },
      },

      'Check if papers were found': {
        always: [
          {
            target: 'Handle error',
            guard: ({ context }) => context.papers.length === 0,
            actions: [assign({ error: () => new Error('No papers found after scraping') })],
          },
          { target: 'Rank papers in batches' },
          // { target: 'Rank papers in batches', actions: [ log('ffs'), log(({context})=> ({papers: context.papers}))] },
        ],
      },

      'Rank papers in batches': {
        entry: [log('- Ranking papers..'), 'setRankingStatus'],
        invoke: {
          src: 'spawnRankingProcess',
          input: ({ context }) => ({ papers: context.papers }),
          onDone: {
            target: 'Store ranked papers',
            actions: [
              assign({
                rankedPapers: ({ event }) =>
                  // Sort within the machine logic
                  event.output?.sort((a, b) => b.relevancy - a.relevancy),
              }),
            ],
          },
          onError: {
            target: 'Handle error',
            actions: assign({
              error: ({ event }) => event.error,
            }),
          },
        },
      },

      'Store ranked papers': {
        entry: log('- Storing papers..'),
        invoke: {
          src: 'storePapers',
          input: ({ context }) => ({ rankedPapers: context.papers }),
          onDone: {
            target: 'Handle done',
          },
          onError: {
            target: 'Handle error',
            actions: assign({
              error: ({ event }) => event.error,
            }),
          },
        },
      },

      'Handle done': {
        entry: [log(`- Sucessfully scraped & ranked papers: ${date}`), 'setCompleteStatus'],
        type: 'final',
      },

      'Handle error': {
        entry: ['logError', 'setErrorStatus'],
        type: 'final',
      },
    },
    output: ({ context }) => context.rankedPapers,
  });
};
