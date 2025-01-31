import { EventEmitter } from 'node:events';
import { mockScores } from './mock-scores';

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
          this.emit('message', { scores: mockScores }); // Example mock scores
        } else {
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
export const fork = jest.fn((scriptPath: string, args: string[]) => {
  const isRankComputer = scriptPath.endsWith('rank-computer.js');
  if (isRankComputer && args.includes('child')) {
    const child = new MockChildProcess();

    setTimeout(() => {
      child.emit('message', { ready: true });
    }, 10);

    return child;
  }

  throw new Error(`Unexpected fork call with scriptPath: ${scriptPath}`);
});
