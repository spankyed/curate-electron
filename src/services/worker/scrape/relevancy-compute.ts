import repository, { ReferenceCollectionName } from './repository';
import { chunkArray, determineBatchSize } from './process-constraints';

export async function getRelevancyScores0(papers: any[], nResults = 5) {
  console.log('Starting getRelevancyScores...');

  if (!repository.chroma.checkForExistingReferenceCollection()) {
    throw new Error(`Collection ${ReferenceCollectionName} does not exist`);
  }

  console.log('Number of papers:', papers.length);

  const batchSize = determineBatchSize();
  console.log('batchSize: ', batchSize);

  // const paperTexts = papers.map((paper) => `${paper.title}. ${paper.abstract}`);

  const paperTexts = papers.slice(0, 10).map((paper) => `${paper.title}. ${paper.abstract}`);
  // .slice(0, 125); // ! TODO: Remove this slice

  try {
    const results = await repository.chroma.queryReferenceCollection(paperTexts, nResults);
    // console.log('results: ', results);

    // Map over results and papers to set relevancy properties
    papers.forEach((paper, index) => {
      const relevancyScores = results.distances?.[index] ? results.distances?.[index] : [];
      // console.log('relevancyScores: ', relevancyScores);
      const avgRelevancy =
        relevancyScores.reduce((a, b) => a + b, 0) / (relevancyScores.length || 1);

      paper.relevancy = avgRelevancy ? 1 - avgRelevancy : 0;

      // console.log("Avg Relevancy for paper:", paper.id, "is:", avgRelevancy);
    });
  } catch (err) {
    console.error(err);
  }

  console.log('Completed getRelevancyScores');
  return papers;
}

export async function getRelevancyScores(papers, nResults = 5) {
  console.log('Starting getRelevancyScores...');

  try {
    const collectionExists = await repository.chroma.checkForExistingReferenceCollection();
    if (!collectionExists) {
      throw new Error(`Collection ${ReferenceCollectionName} does not exist`);
    }

    console.log('Number of papers:', papers.length);

    const batchSize = 50;
    // const batchSize = determineBatchSize();
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

async function getRelevancyScores2(papers, nResults = 5) {
  let batchSize = 100; // Start with a large batch size
  let success = false;

  while (!success && batchSize >= 10) {
    try {
      const batchedPapers = chunkArray(papers, batchSize);
      // Process batches as before
      success = true;
    } catch (err) {
      console.error(`Error with batch size ${batchSize}:`, err);
      batchSize = Math.floor(batchSize / 2); // Reduce batch size
    }
  }

  if (!success) {
    throw new Error('Unable to process papers due to resource constraints.');
  }
}
