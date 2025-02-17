/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type ActorRefFromLogic,
  type AnyActorLogic,
  assign,
  fromCallback,
  log,
  setup,
} from 'xstate';
import { chunkArray, getAvgScore } from '@services/worker/scrape-rank/utils';
import type { PaperRecord } from '@services/shared/types';
import path from 'node:path';
import { fork } from 'node:child_process';

interface ChildMessage {
  type: 'PROC.ERROR' | 'PROC.SCORES' | 'PROC.DONE';
  ready?: boolean;
  scores?: number[];
  error?: string;
}

export function createProcessManagerActor() {
  const pathToChildScript = path.resolve(__dirname, 'child-process.js');

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
      // hasMoreBatches: ({ context }) => context.currentBatchIndex < context.batches.length - 1,
    },
    actors: {
      childProcess: fromCallback(({ sendBack, receive }) => {
        const child = fork(pathToChildScript, ['child']);

        child.on('message', (message: ChildMessage) => {
          console.log('[proc manager] Message: ', message);
          if (message.type === 'PROC.ERROR') {
            sendBack({ type: 'PROC.ERROR', error: new Error(message.error) });
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
          if (event.type === 'RECIEVE_BATCH') {
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
      spawnChildProcess: assign({
        childProcActorRef: ({ spawn }) => spawn('childProcess'),
      }),
      sendNextBatch: ({ context }) => {
        const currentBatch = context.batches[context.currentBatchIndex];
        const isLastBatch = context.currentBatchIndex === context.batches.length - 1;
        console.log('currentBatch: ', currentBatch);

        context.childProcActorRef?.send({
          type: 'RECIEVE_BATCH', // (Also consider correcting the spelling: RECEIVE_BATCH)
          batch: currentBatch,
          // batchId: nextBatchIdx,
          isLastBatch,
        });
      },
      receiveError: assign({
        error: ({ event }) => event.error,
      }),
      mergeScores: assign(({ context, event }) => {
        const currentBatch = context.batches[context.currentBatchIndex];

        const scoredBatch = currentBatch.map((paper, index) => ({
          ...paper,
          relevancy: getAvgScore(event.scores[index]),
        }));

        const updatedResults = [...context.results, ...scoredBatch];

        return {
          results: updatedResults,
        };
      }),
      throwError: ({ context }) => {
        throw context.error;
        // console.error('Ranking process failed:', context.error);
      },
    },
  }).createMachine({
    id: 'process-manager',
    initial: 'Chunk into batches',
    context: ({ input }: any) => ({
      // context: ({ input }: { input: { papers: PaperRecord[] } }) => ({
      papers: input.papers,
      batchSize: 10,
      // batchSize: 50,
      batches: [],
      currentBatchIndex: 0,
      results: [],
      childProcActorRef: undefined,
      error: undefined,
    }),
    // context: {
    //   papers: initialPapers,
    //   batchSize: 50,
    //   batches: [],
    //   currentBatchIndex: 0,
    //   results: [],
    //   childProcActorRef: undefined,
    //   error: undefined,
    // },
    states: {
      'Chunk into batches': {
        entry: assign({
          batches: ({ context }) => chunkArray(context.papers, context.batchSize),
        }),
        always: {
          guard: ({ context }) => context.papers.length > 0,
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
        entry: 'sendNextBatch',
        on: {
          'PROC.ERROR': {
            target: 'Handle error',
            actions: assign({
              error: ({ event }) => event.error,
            }),
          },
          'PROC.SCORES': [
            {
              target: 'Handle error',
              guard: ({ event }) => !event.scores || event.scores.length === 0,
              actions: assign({ error: () => new Error('No scores received for the batch') }),
            },
            {
              target: 'Handle error',
              guard: ({ context, event }) => {
                console.log('event.scores: ', event.scores);
                // console.log({ batches: JSON.stringify(context.batches, null, 2), curreBatch: context.currentBatchIndex });

                console.log('check', context.batches[context.currentBatchIndex].length !== event.scores.length)
                console.log('made it past check');
                return context.batches[context.currentBatchIndex].length !== event.scores.length
              },
              actions: assign({
                error: () => new Error('Mismatch between the number of papers and scores'),
              }),
            },
            {
              actions: [
                'sendNextBatch',
                'mergeScores',
                assign({
                  currentBatchIndex: ({ context }) => context.currentBatchIndex + 1,
                }),
              ],
            },
          ],
          'PROC.DONE': {
            target: 'Handle done',
          },
        },
      },

      'Handle done': {
        entry: [log('All batches processed successfully!')],
        type: 'final',
        // output: ({ context }) => context.results,
      },

      'Handle error': {
        entry: 'throwError',
        type: 'final',
      },
    },

    output: ({ context }) => context.results,
  });
}
