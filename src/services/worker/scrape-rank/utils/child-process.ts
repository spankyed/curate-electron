import { createActor } from 'xstate';
import { createRankComputerActor } from '@services/worker/scrape-rank/actors/similarity-computer';
import { getRelevancyScores } from '@services/worker/scrape-rank/utils';

const rankComputerMachine = createRankComputerActor({ getRelevancyScores });
const actor = createActor(rankComputerMachine);

actor.start();
