import * as sharedRepository from '@services/shared/repository';
import repository from '@services/maintenance/repository';
import scrapePapersByIds from "./scrape-papers-by-ids";
import { getConfig } from '@services/shared/utils/get-config';

// const path =  "/Users/spankyed/Develop/Projects/CurateGPT/services/database/generated/research-papers.json";
// const refPapers = JSON.parse(fs.readFileSync(path, "utf-8"));
// seedReferencePapersIfNeeded(refPapers, true);
// seedReferencePapersIfNeeded([], true);

export function doesReferenceCollectionExist() {
  return sharedRepository.chroma.checkForExistingReferenceCollection();
}

export async function seedReferencePapers(papers?: any[], ids = null) {
  await sharedRepository.chroma.initializeReferenceCollection()

  if (!papers || !papers.length) {
    papers = await scrapeAndStoreReferencePapers(ids)
  }

  await sharedRepository.chroma.addToReferenceCollection(papers)

  const count = await sharedRepository.chroma.getReferenceCollectionCount();

  if (count !== papers.length) {
    throw new Error(`Failed to seed reference papers. Expected ${papers.length} but got ${count}`);
  }

  return papers;
}


async function scrapeAndStoreReferencePapers(ids =  null) {
  const seedReferencesIds = ids || (await getConfig()).seedReferencesIds!;
  console.log('Scraping and storing reference papers: ', ids);

  const referencePapers = await scrapePapersByIds(seedReferencesIds);

  const scrapedIds = referencePapers.map(paper => paper.id);
  const datesToStore = referencePapers
    .map(paper => paper.date)
    .filter((date, index, array) => array.indexOf(date) === index); // Remove duplicates

  await repository.storeDates(datesToStore)
  
  await Promise.all([
    repository.storeReferencePapers(scrapedIds),
    sharedRepository.storePapers(referencePapers)
  ]);

  console.log('Reference papers added.', ids);

  return referencePapers;
}
