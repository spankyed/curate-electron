import { setup, assign, fromPromise, type ErrorActorEvent } from 'xstate';
import { getRelevancyScores } from './utils';
import type { PaperRecord } from '@services/shared/types';

// ----------------------------------------------------------------
// Define the XState machine
// ----------------------------------------------------------------

export function createRankMachine() {
  return setup({
    types: {} as {
      context: {
        papers: PaperRecord[];
        rankedPapers: PaperRecord[];
        error: ErrorActorEvent['error'];
        // error: Error | null;
      };
    },
    actors: {
      computeScores: fromPromise(async ({ input }: { input: { papers: PaperRecord[] } }) => {
        const rankedPapers = await getRelevancyScores(input.papers);
        return rankedPapers;
      }),
    },
    actions: {
      sendSuccess: ({ context }) => {
        process.send?.({ rankedPapers: context.rankedPapers });
      },
      sendError: ({ context }) => {
        process.send?.({ error: (context.error as { message: string })?.message });
      },
    },
  }).createMachine({
    id: 'ranking-processor',
    initial: 'Wait for start',
    context: {
      papers: [],
      rankedPapers: [],
      error: null,
    },
    states: {
      'Wait for start': {
        on: {
          START: {
            target: 'Compute scores',
            actions: assign({
              papers: ({ event }) => event.output,
            }),
          },
        },
      },

      'Compute scores': {
        invoke: {
          src: 'computeScores',
          input: ({ context }) => ({ papers: context.papers }),
          onDone: {
            target: 'Handle success',
            actions: assign({
              rankedPapers: ({ event }) => event.output,
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

      'Handle success': {
        entry: 'sendSuccess',
        type: 'final',
      },

      'Handle error': {
        entry: 'sendError',
        type: 'final',
      },
    },
  });
}
