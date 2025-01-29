import {
  setup,
  assign,
  fromPromise,
  type ErrorActorEvent,
  spawnChild,
  fromCallback,
  AnyEventObject,
  log,
} from 'xstate';
import { getRelevancyScores } from '../utils';
import type { PaperRecord } from '@services/shared/types';
import { createActor } from 'xstate';

const rankComputerMachine = setup({
  types: {
    context: {} as {
      batchId: number;
      batch: PaperRecord[];
      // scores: PaperRecord[];
      scores: number[][];
      isLastBatch: boolean;
      error: ErrorActorEvent['error'];
      // error: Error | null;
    },
    // events: {} as
    //   | ErrorActorEvent<unknown, string>
    //   | {
    //       type: 'RECIEVE_BATCH';
    //       batch: PaperRecord[];
    //       isLastBatch?: boolean;
    //     },
  },
  guards: {
    isLastBatch: ({ context }) => context.isLastBatch,
  },
  actors: {
    processListener: fromCallback(({ sendBack }) => {
      process.on('message', async (message: AnyEventObject) => {
        // if (!process.send) {
        //   throw new Error('This script must be run as a child process');
        // }

        sendBack(message);
      });

      process.send?.({ type: 'PROC.READY', ready: true });
    }),
    computeScores: fromPromise(async ({ input }: { input: { batch: PaperRecord[] } }) => {
      // console.log('computeScores', input.batch);
      const rankedPapers = await getRelevancyScores(input.batch);
      return rankedPapers;
    }),
  },
  actions: {
    setError: assign({
      error: ({ event }) => event.error,
    }),
    setBatch: assign({
      batch: ({ event }) => event.batch,
      isLastBatch: ({ event }) => event.isLastBatch || false,
      batchId: ({ context }) => context.batchId + 1,
    }),
    setScores: assign({
      scores: ({ event }) => event.output,
    }),
    sendBatchScores: ({ event }) => {
      process.send?.({ type: 'PROC.SCORES', scores: event.output.scores });
    },
    sendDone: () => {
      process.send?.({ type: 'PROC.DONE' });
    },
    sendError: ({ context }) => {
      process.send?.({ error: (context.error as { message: string })?.message });
    },
  },
}).createMachine({
  id: 'rank-computer',
  initial: 'Wait for batch',
  context: {
    batchId: 0,
    batch: [],
    scores: [],
    isLastBatch: false,
    error: null,
  },
  entry: spawnChild('processListener'),
  states: {
    'Wait for batch': {
      on: {
        RECIEVE_BATCH: {
          target: 'Process batch',
          // actions: [log(({ event }) => event), 'setBatch'],
          actions: ['setBatch'],
        },
      },
    },

    'Process batch': {
      invoke: {
        src: 'computeScores',
        input: ({ context }) => ({ batch: context.batch }),
        onDone: [
          {
            guard: 'isLastBatch',
            target: 'Handle done',
            actions: ['setScores', 'sendBatchScores'],
          },
          {
            target: 'Wait for batch',
            actions: ['setScores', 'sendBatchScores'],
          },
        ],
        onError: {
          target: 'Handle error',
          actions: 'setError',
        },
      },
    },

    'Handle done': {
      entry: 'sendDone',
      type: 'final',
    },

    'Handle error': {
      entry: 'sendError',
      type: 'final',
    },
  },
});

const actor = createActor(rankComputerMachine);

// actor.subscribe({
//   next: (state) => {
//     console.log('Current state:', state.value);
//   },
//   error: (error) => {
//     console.error('Unhandled error in rank-computer:', error);
//   },
//   complete: () => {
//     console.log('rank-computer completed');
//   },
// });

actor.start();
