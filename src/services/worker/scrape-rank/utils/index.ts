import os from 'node:os';
import repository, { ReferenceCollectionName } from './repository';
import type { PaperRecord } from '@services/shared/types';

export async function getRelevancyScores(papersBatch: PaperRecord[], nResults = 5) {
  console.log('-- Starting get-relevancy-scores');

  const collectionExists = await repository.chroma.checkForExistingReferenceCollection();
  if (!collectionExists) {
    throw new Error(`Collection ${ReferenceCollectionName} does not exist`);
  }

  try {
    console.log('   Total number of papers in batch:', papersBatch.length);

    // console.log(`   Processing batch [${papersBatch.length}] (${i + 1} of ${papersBatch.length})`);

    const queryTexts = papersBatch.map((paper) => `${paper.title}. ${paper.abstract}`);

    // todo query for free memory ?
    const results = await repository.chroma.queryReferenceCollection(queryTexts, nResults);

    return results.distances;

    // papersBatch.forEach((paper, index) => {
    //   const relevancyScores = results.distances?.[index] || [];
    //   const avgRelevancy =
    //     relevancyScores.reduce((a, b) => a + b, 0) / (relevancyScores.length || 1);
    //   paper.relevancy = avgRelevancy ? 1 - avgRelevancy : 0;
    // });

    // console.log('-- Completed get-relevancy-scores');
    // return papersBatch;
  } catch (err) {
    console.error('Error in getRelevancyScores:', err);
    throw err;
  }
}

// todo limit the memory allocated to chroma server in order to test whether memory is the bottleneck
// todo if memory isnt the bottleneck, then we spawn workers in order to increase the number of requests that can be handled
export function determineBatchSize() {
  const estimatedMemoryPerItemKB = 30; // As calculated above
  const estimatedMemoryPerItemMB = estimatedMemoryPerItemKB / 1024; // Convert KB to MB

  const freeMemoryMB = os.freemem() / (1024 * 1024);
  const safetyMargin = 0.5; // Use only 50% of free memory
  const usableMemoryMB = freeMemoryMB * safetyMargin;

  const cores = os.cpus().length;

  console.log('os.freemem(): ', os.freemem());
  console.log('os info: ', { freeMemoryMB, cores });

  const batchSize = Math.max(
    10, // Minimum batch size
    Math.floor(usableMemoryMB / estimatedMemoryPerItemMB)
  );

  // Set an upper limit to prevent extremely large batches
  const maxBatchSize = 1000;
  return Math.min(batchSize, maxBatchSize);
}

/**
 * Utility for chunking the papers, if you need it here
 */
export function chunkArray<T>(arr: T[], size: number) {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
