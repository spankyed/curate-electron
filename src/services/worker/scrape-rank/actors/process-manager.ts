import { ActorRefFromLogic, AnyActorLogic, assign, fromCallback, log, setup } from 'xstate';
import { chunkArray } from '../utils';
import type { PaperRecord } from '@services/shared/types';
import path from 'node:path';
import { fork } from 'node:child_process';

const pathToChildScript = path.resolve(__dirname, 'score-computer.js');

interface ChildMessage {
  type: 'PROC.ERROR' | 'PROC.SCORES' | 'PROC.DONE';
  ready?: boolean;
  scores?: number[];
  error?: string;
}

export function createParentRankMachine(initialPapers: PaperRecord[]) {
  return setup({
    types: {} as {
      context: {
        papers: PaperRecord[];
        batchSize: number;
        currentBatchIndex: number;
        batches: PaperRecord[][];
        results: PaperRecord[];
        childProcActorRef?: ActorRefFromLogic<AnyActorLogic>;
        error?: Error | string;
      };
    },
    guards: {
      hasMoreBatches: ({ context }) => context.currentBatchIndex < context.batches.length - 1,
    },
    actors: {
      childProcess: fromCallback(({ sendBack, receive }) => {
        const child = fork(pathToChildScript, ['child']);

        child.on('message', (message: ChildMessage) => {
          if (message.ready) {
            sendBack({ type: 'PROC.READY' });
          } else if (message.scores) {
            sendBack(message);
            // sendBack({ type: 'PROC.SCORES', scores: message.scores });
          } else if (message.error) {
            sendBack({ type: 'PROC.ERROR', error: new Error(message.error) });
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
        // const currentBatch = context.batches[context.currentBatchIndex];
        const nextBatchIdx = context.currentBatchIndex + 1;
        const nextBactch = context.batches[nextBatchIdx];
        const isLastBatch = nextBatchIdx === context.batches.length - 1;

        context.childProcActorRef?.send({
          type: 'RECIEVE_BATCH',
          batch: nextBactch,
          // batchId: nextBatchIdx,
          isLastBatch,
        });
      },
      receiveError: assign({
        error: ({ event }) => event.error,
      }),
      mergeScores: assign(({ context, event }) => {
        if (!event.scores || event.scores.length === 0) {
          throw new Error('No scores received for the batch');
        }

        const currentBatch = context.batches[context.currentBatchIndex];

        if (currentBatch.length !== event.scores.length) {
          throw new Error('Mismatch between the number of papers and scores');
        }

        const scoredBatch = currentBatch.map((paper, index) => ({
          ...paper,
          score: event.scores[index],
        }));

        const updatedResults = [...context.results, ...scoredBatch];

        return {
          results: updatedResults,
        };
      }),
      emitError: ({ context }) => {
        console.error('Ranking process failed:', context.error);
      },
    },
  }).createMachine({
    id: 'fork-machine',
    initial: 'Chunk into batches',
    context: {
      papers: initialPapers,
      batchSize: 50,
      batches: [],
      childProcActorRef: undefined,
      currentBatchIndex: 0,
      results: [],
    },
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
            target: 'Handler Failure',
            actions: assign({
              error: ({ event }) => event.error,
            }),
          },
          'PROC.SCORES': {
            actions: [
              'sendNextBatch',
              'mergeScores',
              assign({
                currentBatchIndex: ({ context }) => context.currentBatchIndex + 1,
              }),
            ],
          },
          'PROC.DONE': {
            target: 'Handle Success',
          },
        },
      },

      'Handle Success': {
        entry: [log('All batches processed successfully!')],
        type: 'final',
        output: ({ context }) => context.results,
      },

      'Handle Failure': {
        entry: 'emitError',
        type: 'final',
      },
    },
  });
}
