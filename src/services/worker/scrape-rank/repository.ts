import { ChromaClient } from 'chromadb';

export const ReferenceCollectionName = 'paper-embeddings';

const client = new ChromaClient({
  // path: "http://localhost:8000"
});

type InferredCollection = Awaited<ReturnType<typeof client.getOrCreateCollection>>;

let cachedCollection: InferredCollection | null = null;

async function getReferenceCollection() {
  if (!cachedCollection) {
    cachedCollection = await client.getOrCreateCollection({ name: ReferenceCollectionName });
  }
  return cachedCollection;
}

async function queryReferenceCollection(corpus: string[], nResults = 5) {
  const collection = await getReferenceCollection();

  return collection.query({
    queryTexts: corpus,
    nResults: nResults, // ! not optimized
  });
}

async function checkForExistingReferenceCollection() {
  const existingCollections = await client.listCollections();

  return existingCollections.map((c) => c.name).includes(ReferenceCollectionName);
}

const chroma = {
  queryReferenceCollection,
  checkForExistingReferenceCollection,
};

export default {
  chroma,
};
