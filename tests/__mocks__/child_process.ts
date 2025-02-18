import { EventEmitter } from 'node:events';
import { mockTopDistances } from './mock-distances';

// Mock implementation of `fork`
// export const fork = vi.fn((scriptPath: string, args: string[]) => {
//   const isRankComputer = scriptPath.endsWith('child-process.js');

//   if (isRankComputer && args.includes('child')) {
//     const child = new MockChildProcess();

//     setTimeout(() => {
//       child.emit('message', { type: 'PROC.READY' });
//     }, 10);

//     return child;
//   }

//   throw new Error(`Unexpected fork call with scriptPath: ${scriptPath}`);
// });

type Message = {
  type: string;
  batch: unknown[];
};

export class MockChildProcess extends EventEmitter {
  private isKilled = false;
  send(message: Message) {
    if (this.isKilled) {
      throw new Error('Cannot send message to a killed process');
    }

    if (message.type === 'RECEIVE_BATCH') {
      const batchLength = message.batch.length;

      setTimeout(() => {
        this.emit('message', {
          type: 'PROC.DISTANCES',
          distances: randomizeDistances(mockTopDistances.slice(0, batchLength)),
        });
      }, 50); // Simulate async delay
    }
  }

  kill() {
    this.isKilled = true;
    this.emit('exit', 0); // Emit an exit event with code 0
  }
}

export function randomizeDistances(distances: number[][]): number[][] {
  return distances.map((row) =>
    row.map((distance) => {
      // Generate a small random delta in the range [-0.02, +0.02]
      const delta = (Math.random() - 0.5) * 0.04;
      let newDistance = distance + delta;
      // Clamp the new distance between 0 and 1
      newDistance = Math.min(1, Math.max(0, newDistance));
      return newDistance;
    })
  );
}
