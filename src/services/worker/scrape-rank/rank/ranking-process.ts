import os from 'node:os';
import repository, { ReferenceCollectionName } from '../repository';

if (!process.send) {
  throw new Error('This script must be run as a child process');
}
process.on('message', async (papers) => {
  if (!process.send) {
    throw new Error('This script must be run as a child process');
  }

  try {
    const rankedPapers = await getRelevancyScores(papers);

    process.send({ rankedPapers });
  } catch (error) {
    process.send({ error: error.message });
  }
});

process.send({ ready: true });

export async function getRelevancyScores(papers, nResults = 5) {
  console.log('Starting getRelevancyScores...');

  const collectionExists = await repository.chroma.checkForExistingReferenceCollection();
  if (!collectionExists) {
    throw new Error(`Collection ${ReferenceCollectionName} does not exist`);
  }

  try {
    console.log('Number of papers:', papers.length);

    // const batchSize = determineBatchSize();
    const batchSize = 50;
    const batchedPapers = chunkArray(papers, batchSize);

    for (let i = 0; i < batchedPapers.length; i++) {
      const batch = batchedPapers[i];
      console.log(`Processing batch ${i + 1} of ${batchedPapers.length}`);

      const paperTexts = batch.map((paper) => `${paper.title}. ${paper.abstract}`);

      const results = await repository.chroma.queryReferenceCollection(paperTexts, nResults);

      batch.forEach((paper, index) => {
        const relevancyScores = results.distances?.[index] || [];
        const avgRelevancy =
          relevancyScores.reduce((a, b) => a + b, 0) / (relevancyScores.length || 1);
        paper.relevancy = avgRelevancy ? 1 - avgRelevancy : 0;
      });
    }

    console.log('Completed getRelevancyScores');
    return papers;
  } catch (err) {
    console.error('Error in getRelevancyScores:', err);
    throw err;
  }
}

// todo limit the memory allocated to chroma server in order to test whether memory is the bottleneck
// todo if memory isnt the bottleneck, then we spawn workers in order to increase the number of requests that can be handled
// export function determineBatchSize3() {
//   // const estimatedMemoryPerItem = 0.5; // MB

//   const cores = os.cpus().length;

//   const estimatedMemoryPerItemKB = 30; // As calculated above
//   const estimatedMemoryPerItemMB = estimatedMemoryPerItemKB / 1024; // Convert KB to MB

//   const freeMemoryMB = os.freemem() / (1024 * 1024);
//   console.log('os.freemem(): ', os.freemem());
//   console.log('os info: ', {freeMemoryMB, cores});
//   const batchSize = Math.max(10, Math.floor(freeMemoryMB / estimatedMemoryPerItem));
//   return [batchSize, cores];
// }

export function determineBatchSize() {
  const estimatedMemoryPerItemKB = 30; // As calculated above
  const estimatedMemoryPerItemMB = estimatedMemoryPerItemKB / 1024; // Convert KB to MB

  const freeMemoryMB = os.freemem() / (1024 * 1024);
  const safetyMargin = 0.5; // Use only 50% of free memory
  const usableMemoryMB = freeMemoryMB * safetyMargin;

  const cores = os.cpus().length;

  console.log('os.freemem(): ', os.freemem());
  console.log('os info: ', {freeMemoryMB, cores});

  const batchSize = Math.max(
    10, // Minimum batch size
    Math.floor(usableMemoryMB / estimatedMemoryPerItemMB)
  );

  // Set an upper limit to prevent extremely large batches
  const maxBatchSize = 1000;
  return Math.min(batchSize, maxBatchSize);
}

export function chunkArray(array, size) {
  const result: any[] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// function determineBatchSize1() {
//   const defaultBatchSize = 10;
//   // Optionally, adjust based on system info
//   return defaultBatchSize;
// }

// function determineBatchSize2() {
//   const cores = navigator.hardwareConcurrency || 4; // Default to 4 if not available
//   return Math.max(10, cores * 2); // Adjust multiplier as needed
// }

// async function getRelevancyScores2(papers, nResults = 5) {
//   let batchSize = 100; // Start with a large batch size
//   let success = false;

//   while (!success && batchSize >= 10) {
//     try {
//       const batchedPapers = chunkArray(papers, batchSize);
//       // Process batches as before
//       success = true;
//     } catch (err) {
//       console.error(`Error with batch size ${batchSize}:`, err);
//       batchSize = Math.floor(batchSize / 2); // Reduce batch size
//     }
//   }

//   if (!success) {
//     throw new Error('Unable to process papers due to resource constraints.');
//   }
// }
