import { ActorRefFromLogic, AnyActorLogic, assign, fromCallback, log, setup } from 'xstate';
import { chunkArray } from './utils';
import type { PaperRecord } from '@services/shared/types';
import path from 'node:path';
import { fork } from 'node:child_process';

// The shape of data we receive from the child
interface ChildMessage {
  ready?: boolean; // child signals readiness
  scores?: number[]; // example from your snippet
  error?: string;
}

type ParentEvent =
  | { type: 'START'; data: PaperRecord[] }
  | { type: 'PROC.READY' }
  | { type: 'PROC.SCORES'; scores: number[] }
  | { type: 'PROC.ERROR'; error: string }
  | { type: 'PROC.COMPLETE' }
  | { type: 'NEXT_BATCH' }
  | { type: 'done.invoke.spawnChildProcess' } // for completeness
  | { type: 'error.platform.spawnChildProcess'; data: any };

// The state machine
export function createParentRankMachine(initialPapers: PaperRecord[]) {
  return setup({
    types: {} as {
      context: {
        papers: PaperRecord[];
        batches: PaperRecord[][];
        currentBatchIndex: number;
        childProcActorRef?: ActorRefFromLogic<AnyActorLogic>;
        error?: Error | string;
        results: PaperRecord[];
        batchSize: number;
        isComplete: boolean;
      };
      // events: ParentEvent;
    },
    guards: {
      hasMoreBatches: ({ context }) => context.currentBatchIndex < context.batches.length - 1,
    },
    actors: {
      childProcess: fromCallback(({ sendBack, receive }) => {
        const childPath = path.resolve(__dirname, 'ranking-process.js');
        const child = fork(childPath, ['child']);

        child.on('message', (message: ChildMessage) => {
          if (message.ready) {
            sendBack({ type: 'READY' });
          } else if (message.scores) {
            sendBack({ type: 'SCORES', scores: message.scores });
          } else if (message.error) {
            sendBack({ type: 'ERROR', error: new Error(message.error) });
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
          } else if (event.type === 'COMPLETE') {
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
        const { currentBatchIndex, batches, results } = context;
        const { scores } = event as unknown as { scores: number[] };

        // Example approach: if the child returns just an array of numbers,
        // you must map them back onto the correct papers in `results`.
        // Typically, you'd store the final relevancy in the "batch" itself.
        // This is just a placeholder example:

        // 1) find the batch in `results` or `batches`
        const batch = batches[currentBatchIndex];
        // 2) attach scores to each paper
        batch.forEach((paper, i) => {
          paper.relevancy = scores[i];
        });
        // 3) Merge the updated batch back into `results`
        //   e.g. if `results` is a flat array, you compute an offset
        // For simplicity, let's assume results is also chunked or we flatten at the end.

        return {
          ...context,
          results, // now updated in place
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
      isComplete: false,
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
          READY: 'Send batches',
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
          'PROC.COMPLETE': {
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
