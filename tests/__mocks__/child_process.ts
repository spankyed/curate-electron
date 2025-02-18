import { EventEmitter } from 'node:events';
import { mockDistances } from './mock-scores';
import { vi } from 'vitest';

type Message = {
  type: string;
  isLastBatch?: boolean;
};

class MockChildProcess extends EventEmitter {
  private isKilled = false;

  send(message: Message) {
    if (this.isKilled) {
      throw new Error('Cannot send message to a killed process');
    }

    if (message.type === 'RECIEVE_BATCH') {
      setTimeout(() => {
        if (!message.isLastBatch) {
          this.emit('message', {
            type: 'PROC.DISTANCES',
            distances: randomizeDistances(mockDistances),
          });
        } else {
          this.emit('message', {
            type: 'PROC.DISTANCES',
            distances: randomizeDistances(mockDistances),
          });
          this.emit('message', { type: 'PROC.DONE' });
        }
      }, 50); // Simulate async delay
    }
  }

  kill() {
    this.isKilled = true;
    this.emit('exit', 0); // Emit an exit event with code 0
  }
}

// Mock implementation of `fork`
export const fork = vi.fn((scriptPath: string, args: string[]) => {
  const isRankComputer = scriptPath.endsWith('child-process.js');

  if (isRankComputer && args.includes('child')) {
    const child = new MockChildProcess();

    setTimeout(() => {
      child.emit('message', { type: 'PROC.READY' });
    }, 10);

    return child;
  }

  throw new Error(`Unexpected fork call with scriptPath: ${scriptPath}`);
});

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
