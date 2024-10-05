import repository from '@services/maintenance/repository';
import { doesReferenceCollectionExist, seedReferencePapers } from "./seed-reference-papers";

export async function ensureReferenceCollectionExists() {
  const collectionExists = await doesReferenceCollectionExist();

  if (!collectionExists) {
    const referencePapers = await repository.getReferencePapers();

    await seedReferencePapers(referencePapers); // paranoid seeding
  }
}
