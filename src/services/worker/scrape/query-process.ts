// query-process.js
import repository, { ReferenceCollectionName } from './repository';

// Using child_process.fork
process.on('message', async (message) => {
  try {
    const { batch, nResults } = message;
    console.log('querying', nResults);
    const results = await repository.chroma.queryReferenceCollection(batch, nResults);
    console.log('results: ', results);
    // const results = await getRelevancyScoresForBatch(batch, nResults);
    process.send({ results });
  } catch (error) {
    process.send({ error: error.message });
  }
});
