import {
  type ActorRefFromLogic,
  type AnyActorLogic,
  assign,
  fromCallback,
  log,
  setup,
  not,
} from 'xstate';
import { chunkArray, averageSimilarityScores } from '@services/worker/scrape-rank/utils';
import type { PaperRecord } from '@services/shared/types';
import path from 'node:path';
import { fork } from 'node:child_process';

interface ChildMessage {
  type: 'PROC.ERROR' | 'PROC.DISTANCES' | 'PROC.DONE';
  ready?: boolean;
  distances?: number[];
  error?: string;
}

export function createProcessManagerActor(batchSize: number) {
  const pathToChildScript = path.resolve(__dirname, 'child-process-entry.js');

  return setup({
    types: {} as {
      context: {
        papers: PaperRecord[];
        batchSize: number;
        batches: PaperRecord[][];
        currentBatchIndex: number;
        results: PaperRecord[];
        childProcActorRef?: ActorRefFromLogic<AnyActorLogic>;
        error?: Error | string;
      };
      output: PaperRecord[];
    },
    guards: {
      hasPapers: ({ context }) => context.papers.length > 0,
      wasLastBatch: ({ context }) => context.currentBatchIndex === context.batches.length - 1,
      hasDistances: ({ event }) => event.distances && event.distances.length > 0,
      batchSizeMismatch: ({ context, event }) =>
        context.batches[context.currentBatchIndex].length !== event.distances.length,
    },
    actors: {
      childProcess: fromCallback(({ sendBack, receive }) => {
        const child = fork(pathToChildScript, ['child']);

        child.on('message', (message: ChildMessage) => {
          // console.log('[proc manager] Message: ', message);
          if (message.type === 'PROC.ERROR') {
            sendBack({ type: 'PROC.ERROR', error: message.error });
          } else {
            sendBack(message);
          }
        });

        child.on('error', (error) => {
          sendBack({ type: 'PROC.ERROR', error });
          // sendBack({ type: 'ERROR', error });
        });

        child.on('exit', (code) => {
          console.log('Child exited with code:', code);
          if (code !== 0) {
            sendBack({ type: 'EXIT', code });
          }
        });

        receive((event) => {
          if (event.type === 'RECEIVE_BATCH') {
            child.send(event);
          } else if (event.type === 'KILL') {
            child.kill();
          }
        });

        return () => {
          // Cleanup when the actor is stopped
          child.kill();
        };
      }),
    },
    actions: {
      splitIntoBatches: assign({
        batches: ({ context }) => {
          // console.log({ papersCount: context.papers.length, batchCount: chunkArray(context.papers, context.batchSize).length });
          return chunkArray(context.papers, context.batchSize);
        },
        // batches: ({ context }) => chunkArray(context.papers, context.batchSize),
      }),
      spawnChildProcess: assign({
        childProcActorRef: ({ spawn }) => spawn('childProcess'),
      }),
      sendBatch: ({ context }) => {
        const currentBatch = context.batches[context.currentBatchIndex];

        context.childProcActorRef?.send({
          type: 'RECEIVE_BATCH',
          batch: currentBatch,
        });
      },
      receiveError: assign({
        error: ({ event }) => event.error,
      }),
      mergeInSimilarityScores: assign(({ context, event }) => {
        // console.log('event.distances: ', event.distances);

        const processedBatch = context.batches[context.currentBatchIndex];

        const scoredBatch = processedBatch.map((paper, index) => ({
          ...paper,
          relevancy: averageSimilarityScores(event.distances[index]),
        }));

        const updatedResults = [...context.results, ...scoredBatch];

        return {
          results: updatedResults,
        };
      }),
      incrementBatchIndex: assign({
        currentBatchIndex: ({ context }) => context.currentBatchIndex + 1,
      }),
      throwError: ({ context }) => {
        throw context.error;
        // console.error('Ranking process failed:', context.error);
      },
      setError: assign({
        error: (_, params: { message: string }) => new Error(params.message),
      }),
    },
  }).createMachine({
    id: 'process-manager',
    initial: 'Split into batches',
    context: ({ input }: any) => ({
      // context: ({ input }: { input: { papers: PaperRecord[] } }) => ({
      papers: input.papers,
      batchSize,
      batches: [],
      currentBatchIndex: 0,
      results: [],
      childProcActorRef: undefined,
      error: undefined,
    }),
    states: {
      'Split into batches': {
        always: {
          guard: 'hasPapers',
          actions: 'splitIntoBatches',
          target: 'Spawn child process',
        },
      },

      'Spawn child process': {
        entry: 'spawnChildProcess',
        on: {
          'PROC.READY': 'Send batches',
        },
      },

      'Send batches': {
        entry: ['sendBatch'],
        on: {
          'PROC.ERROR': {
            target: 'Handle error',
            actions: {
              type: 'setError',
              params: ({ event }) => ({ message: event.error }),
            },
          },
          'PROC.DISTANCES': [
            {
              target: 'Handle error',
              guard: not('hasDistances'),
              actions: {
                type: 'setError',
                params: { message: 'No distances received for the batch' },
              },
            },
            {
              target: 'Handle error',
              guard: 'batchSizeMismatch', // should never occur
              actions: {
                type: 'setError',
                params: {
                  message:
                    'Mismatch between the number of papers in the current batch and distances received',
                },
              },
            },
            {
              target: 'Merge in similarity scores',
            },
          ],
          'PROC.DONE': {
            target: 'Handle done',
          },
        },
      },

      'Merge in similarity scores': {
        entry: 'mergeInSimilarityScores',
        always: [
          {
            guard: not('wasLastBatch'),
            target: 'Send batches',
            actions: 'incrementBatchIndex',
          },
          {
            target: 'Handle done',
          },
        ],
      },

      'Handle done': {
        entry: [
          log('All batches processed successfully!'),
          // log(({ context }) => ({ resultsLength: context.results.length })),
        ],
        type: 'final',
      },

      'Handle error': {
        entry: 'throwError',
        type: 'final',
      },
    },

    output: ({ context }) => context.results,
  });
}
