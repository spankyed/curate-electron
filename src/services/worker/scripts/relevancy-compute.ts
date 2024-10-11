import { ReferenceCollectionName } from '@services/shared/constants';
import repository from '../repository';
import * as sharedRepository from '@services/shared/repository';

export async function getRelevancyScores(papers: any[], nResults = 5): Promise<any[]> {
  console.log('Starting getRelevancyScores...');

  if (!sharedRepository.chroma.checkForExistingReferenceCollection()) {
    throw new Error(`Collection ${ReferenceCollectionName} does not exist`);
  }

  console.log('Number of papers:', papers.length);

  const paperTexts = papers.map((paper) => paper.title + '. ' + paper.abstract);
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
