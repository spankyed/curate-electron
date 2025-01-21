import { createActor } from "xstate";
import { createRankMachine } from "./state-machine";

// ----------------------------------------------------------------
if (!process.send) {
  throw new Error('This script must be run as a child process');
}

const machine = createRankMachine();
const actor = createActor(machine);

actor.subscribe({
  next: (state) => {
    // You can log state changes here if you want:
    console.log('childWorker state:', state.value);
  },
});

// Start the actor
actor.start();

// Let the parent know we're ready
process.send({ ready: true });

// When we receive papers from the parent, send them into the machine
process.on('message', (papers) => {
  if (!process.send) {
    throw new Error('This script must be run as a child process');
  }
  // Dispatch the START event to the machine
  actor.send({ type: 'START', data: papers });
});
