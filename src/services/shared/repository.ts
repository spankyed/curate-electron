import { DatesTable, PapersTable } from './schema';
import { ChromaClient } from 'chromadb';
// import { createEmbedder } from '@services/shared/embedder';
import type { DateRecord, PaperRecord } from './types';
import moment from 'moment';
import { Sequelize, DataTypes, Op } from 'sequelize';
import { ReferenceCollectionName } from './chroma';

function updateDate(date: string, changes: Partial<DateRecord>): Promise<any> {
  return DatesTable.update(changes, { where: { value: date } });
}

async function getDatesByYear(year: string | number) {
  const existingDates = await DatesTable.findAll({
    where: {
      value: {
        [Op.startsWith]: year,
      },
    },
    raw: true,
  });

  const existingDatesSet = new Set(existingDates.map((date) => date.value));

  const allDates = [];
  const startDate = moment(`${year}-01-01`, 'YYYY-MM-DD');
  const isCurrentYear = moment().year().toString() === year.toString();
  const endDate = isCurrentYear ? moment().endOf('day') : moment(`${year}-12-31`, 'YYYY-MM-DD');

  for (let m = startDate; m.isSameOrBefore(endDate); m.add(1, 'days')) {
    const dateStr = m.format('YYYY-MM-DD');
    const date = { value: dateStr, status: 'pending' };

    // If the date is missing in the database, insert it
    if (!existingDatesSet.has(dateStr)) {
      await DatesTable.create(date, { ignoreDuplicates: true });
      allDates.push(date);
    } else {
      allDates.push(existingDates.find((d) => d.value === dateStr));
    }
  }

  return allDates;
}

async function storePapers(papers: PaperRecord[]): Promise<any> {
  try {
    const result = await PapersTable.bulkCreate(papers, {
      ignoreDuplicates: true,
      // updateOnDuplicate: ['relevancy']
    });
    return result;
  } catch (error: unknown) {
    console.error('Error occurred during bulk create:', error);

    if (error instanceof Error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        const problematicPapers = papers.filter(async (paper) => {
          const exists = await DatesTable.count({ where: { value: paper.date } });
          return exists === 0;
        });

        console.error('Potential problematic papers:', problematicPapers);
      }
    }

    throw error;
  }
}

const client = new ChromaClient();
// const embedder = await createEmbedder();
// let embedder: any = null;
// (async () => {
//   embedder = await createEmbedder();
// })();

// const collection = await client.getCollection({ name: 'paper-embeddings', embeddingFunction: embedder });

async function checkForExistingReferenceCollection() {
  const existingCollections = await client.listCollections();

  return existingCollections.map((c) => c.name).includes(ReferenceCollectionName);
}

async function storeReferencePaperChroma(paper: Partial<PaperRecord>) {
  // const embeddings = await embedder.generate([paper.title + ". " + paper.abstract]);
  const collection = await client.getOrCreateCollection({
    name: ReferenceCollectionName,
    // embeddingFunction: embedder
  });

  await collection.add({
    // embeddings: embeddings,
    documents: [`${paper.title}. ${paper.abstract}`],
    ids: [paper.id!],
  });

  return paper.id;
}

async function addToReferenceCollection(papers: Partial<PaperRecord>[]) {
  const collection = await getReferenceCollection();

  const ids = papers.map((paper) => paper.id!);
  const records = {
    ids,
    documents: papers.map((paper) => `${paper.title}. ${paper.abstract}`),
  };

  await collection.add(records);

  return ids;
}

async function initializeReferenceCollection() {
  const collectionExists = await checkForExistingReferenceCollection();

  if (collectionExists) {
    await client.deleteCollection({ name: ReferenceCollectionName });
  }

  await client.createCollection({
    name: ReferenceCollectionName,
    // embeddingFunction: embedder,
    metadata: { 'hnsw:space': 'cosine' },
  });
}

function deleteReferenceCollection() {
  // return client.reset();
  return client.deleteCollection({ name: ReferenceCollectionName });
}

let cachedCollection: any = null;

async function getReferenceCollection() {
  if (!cachedCollection) {
    cachedCollection = await client.getOrCreateCollection({ name: ReferenceCollectionName });
    // cachedCollection = await client.getCollection({ name: ReferenceCollectionName, embeddingFunction: embedder });
  }
  return cachedCollection;
  // return await client.getCollection({ name: ReferenceCollectionName, embeddingFunction: embedder });
}

async function getReferenceCollectionCount() {
  const collection = await getReferenceCollection();
  return collection.count();
}

const chroma = {
  storeReferencePaperChroma,
  checkForExistingReferenceCollection,
  getReferenceCollection,
  addToReferenceCollection,
  initializeReferenceCollection,
  deleteReferenceCollection,
  getReferenceCollectionCount,
};

export { chroma, updateDate, storePapers, getDatesByYear };
