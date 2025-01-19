import { assign, type ErrorActorEvent, fromPromise, setup } from 'xstate';
import * as sharedRepository from '@services/shared/repository';
import { updateWorkStatus } from '@services/shared/status';
import scrapePapersByDate from './scrape-papers-by-date';
import spawnRankingProcess from './spawn-fork';
import { DateStatuses, type PaperRecord } from '@services/shared/types';

export const createScrapeAndRankMachine = (date: string, alwaysNotify = true) => {
  return setup({
    types: {} as {
      context: {
        date: string;
        alwaysNotify: boolean;
        papers: PaperRecord[];
        rankedPapers: PaperRecord[];
        error: ErrorActorEvent['error'];
      };
    },
    actors: {
      scrapePapersByDate: fromPromise(async ({ input }: { input: { date: string } }) => {
        const papers = await scrapePapersByDate(input.date);

        return papers;
      }),
      rankPapers: fromPromise(
        async ({ input }: { input: { papers: PaperRecord[] } }): Promise<PaperRecord[]> => {
          const rankedPapers = await spawnRankingProcess(input.papers);

          return rankedPapers as PaperRecord[];
        }
      ),
      storePapers: fromPromise(async ({ input }: { input: { rankedPapers: PaperRecord[] } }) => {
        const { rankedPapers } = input;

        await Promise.all([
          sharedRepository.storePapers(rankedPapers),
          sharedRepository.updateDate(date, {
            status: DateStatuses.COMPLETE,
            count: rankedPapers.length,
          }),
        ]);
      }),
    },
    actions: {
      log: (_, params: { message: string }) => console.log(params.message),
      logError: ({ context }) =>
        console.error(
          `Error scraping/ranking papers for [${context.date}]:`,
          (context.error as { message: string })?.message
        ),
      setScrapingStatus: ({ context }) => {
        sharedRepository.updateDate(context.date, { status: DateStatuses.SCRAPING });
        updateWorkStatus(
          { key: context.date, status: DateStatuses.SCRAPING },
          context.alwaysNotify
        );
      },
      setRankingStatus: ({ context }) => {
        sharedRepository.updateDate(context.date, { status: DateStatuses.RANKING });
        updateWorkStatus({ key: context.date, status: DateStatuses.RANKING }, context.alwaysNotify);
      },
      setCompleteStatus: ({ context }) => {
        updateWorkStatus(
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
        sharedRepository.updateDate(context.date, { status: DateStatuses.PENDING });
        updateWorkStatus(
          { key: context.date, status: DateStatuses.ERROR, data: [], final: true },
          context.alwaysNotify
        );
      },
    },
  }).createMachine({
    id: 'scrapes-and-rank-machine',
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
        entry: [
          { type: 'log', params: { message: `_Scraping papers for: ${date}` } },
          'setScrapingStatus',
        ],
        invoke: {
          src: 'scrapePapersByDate',
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
            actions: assign({ error: () => new Error('No papers found after scraping') }),
          },
          { target: 'Rank papers in batches' },
        ],
      },

      'Rank papers in batches': {
        entry: [{ type: 'log', params: { message: '_Ranking papers..' } }, 'setRankingStatus'],
        invoke: {
          src: 'rankPapers',
          input: ({ context }) => ({ papers: context.papers }),
          onDone: {
            target: 'Store ranked papers',
            actions: assign({
              rankedPapers: ({ event }) =>
                // Sort within the machine logic if needed
                event.output.sort((a, b) => b.relevancy - a.relevancy),
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

      'Store ranked papers': {
        entry: [{ type: 'log', params: { message: '_Storing papers..' } }],
        invoke: {
          src: 'storePapers',
          input: ({ context }) => ({ rankedPapers: context.papers }),
          onDone: {
            target: 'Handle success',
          },
          onError: {
            target: 'Handle error',
            actions: assign({
              error: ({ event }) => event.error,
            }),
          },
        },
      },

      'Handle success': {
        entry: [
          { type: 'log', params: { message: `_Sucessfully scraped ranked papers for: ${date}` } },
          'setCompleteStatus',
        ],
        type: 'final',
      },

      'Handle error': {
        entry: ['logError', 'setErrorStatus'],
        type: 'final',
      },
    },
  });
};

/*
  ┌───────────────────────────────────────────┐
  │           .───────────────.               │
  │          ( scrape API req  )              │
  │           `───────────────'               │
  │                   │                       │
  │                   ▼                       │
  │       ┌───────────────────────┐           │
  │       │ scrape arxiv by date  │           │
  │       └───────────────────────┘           │
  │                   │                       │
  │                   │                       │
  │                   ▼                       │
  │                   Λ                       │
  │                  ╱ ╲                      │
  │                 ╱   ╲                     │
  │                ╱     ╲                    │
  │               ╱papers ╲  no   .─────.     │
  │              ▕  were   ▏────▶( error )    │
  │               ╲found? ╱       `─────'     │
  │                ╲     ╱                    │
  │                 ╲   ╱                     │
  │                  ╲ ╱                      │
  │                   V                       │
  │                   │ yes                   │
  │                   ▼                       │
  │        ┌─────────────────────┐            │
  │        │spawn ranking process│            │
  │        └─────────────────────┘            │
  │                   │                       │
  │                   ▼                       │
  │          ┌────────────────┐     .─────.   │
  │       ┌─▶│scape next batch│───▶( error )  │
  │       │  └────────────────┘     `─────'   │
  │       │           │                       │
  │       │           ▼                       │
  │       │           Λ                       │
  │       │          ╱ ╲                      │
  │       │ no      ╱   ╲                     │
  │       └────────▕done?▏                    │
  │                 ╲   ╱                     │
  │                  ╲ ╱                      │
  │                   V                       │
  │               yes │                       │
  │                   ▼                       │
  │                 .───.                     │
  │                ( end )                    │
  │                 `───'                     │
  └───────────────────────────────────────────┘
*/
