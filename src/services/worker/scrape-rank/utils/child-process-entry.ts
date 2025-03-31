import { createActor } from 'xstate';
import { createSimilarityComputer } from '@services/worker/scrape-rank/actors/similarity-computer';
import { computeSimilarity } from '@services/worker/scrape-rank/utils';

const rankComputerMachine = createSimilarityComputer({ computeSimilarity });
const actor = createActor(rankComputerMachine);

actor.start();
