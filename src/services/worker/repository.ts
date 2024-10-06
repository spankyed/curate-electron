import * as sharedRepository from '@services/shared/repository';
// Assuming PaperRecord matches the structure of your PapersTable model
// import { PapersTable } from '../shared/schema';
// import { PaperRecord } from '../shared/types';

async function queryReferenceCollection(corpus: any[], nResults = 5) {
  const collection = await sharedRepository.chroma.getReferenceCollection();

  return collection.query({
    queryTexts: corpus,
    nResults: nResults, // ! not optimized
  })
}

const chroma = {
  queryReferenceCollection
}

export default {
  chroma,
};
