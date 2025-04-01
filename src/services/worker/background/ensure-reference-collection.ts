import repository from '@services/api/onboard/repository';
import {
  doesReferenceCollectionExist,
  seedReferencePapers,
} from '@services/api/onboard/seed-reference-papers';

export async function ensureReferenceCollectionExists() {
  const collectionExists = await doesReferenceCollectionExist();

  if (!collectionExists) {
    const referencePapers = await repository.getReferencePapers();

    await seedReferencePapers(referencePapers); // paranoid seeding
  }
}
