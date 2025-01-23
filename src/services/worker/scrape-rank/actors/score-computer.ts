import {
  setup,
  assign,
  fromPromise,
  type ErrorActorEvent,
  spawnChild,
  fromCallback,
  AnyEventObject,
} from 'xstate';
import { getRelevancyScores } from '../utils';
import type { PaperRecord } from '@services/shared/types';
import { createActor } from 'xstate';

const scoreComputerMachine = setup({
  types: {
    context: {} as {
      batchId: number;
      batch: PaperRecord[];
      // scores: PaperRecord[];
      scores: number[];
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
    computeScores: fromPromise(async ({ input }: { input: { batch: PaperRecord[] } }) => {
      const rankedPapers = await getRelevancyScores(input.batch);
      return rankedPapers;
    }),
    processListener: fromCallback(({ sendBack }) => {
      process.on('message', async (message: AnyEventObject) => {
        // if (!process.send) {
        //   throw new Error('This script must be run as a child process');
        // }

        sendBack(message);
      });

      process.send?.({ type: 'PROC.READY', ready: true });
    }),
  },
  actions: {
    receiveError: assign({
      error: ({ event }) => event.error,
    }),
    receiveBatch: assign({
      batch: ({ event }) => event.batch,
      isLastBatch: ({ event }) => event.isLastBatch || false,
      batchId: ({ context }) => context.batchId + 1,
    }),
    receiveScores: assign({
      scores: ({ event }) => event.output,
    }),
    sendBatchScores: ({ event }) => {
      process.send?.({ type: 'PROC.SCORES', scores: event.output.scores });
    },
    sendComplete: () => {
      process.send?.({ type: 'PROC.DONE' });
    },
    sendError: ({ context }) => {
      process.send?.({ error: (context.error as { message: string })?.message });
    },
  },
}).createMachine({
  id: 'score-computer',
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
          actions: 'receiveBatch',
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
            target: 'Handle success',
            actions: ['receiveScores', 'sendBatchScores'],
          },
          {
            target: 'Wait for Batch',
            actions: ['receiveScores', 'sendBatchScores'],
          },
        ],
        onError: {
          target: 'Handle error',
          actions: 'receiveError',
        },
      },
    },

    'Handle complete': {
      entry: 'sendComplete',
      type: 'final',
    },

    'Handle error': {
      entry: 'sendError',
      type: 'final',
    },
  },
});

const actor = createActor(scoreComputerMachine);

// Subscribe to state changes
actor.subscribe({
  next: (state) => {
    console.log('Current state:', state.value);
  },
  error: (error) => {
    console.error('Unhandled error in score-computer:', error);
  },
  complete: () => {
    console.log('score-computer completed');
  },
});

actor.start();
