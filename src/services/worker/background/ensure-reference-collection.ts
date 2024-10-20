import repository from '@services/web/onboard/repository';
import {
  doesReferenceCollectionExist,
  seedReferencePapers,
} from '@services/web/onboard/seed-reference-papers';

export async function ensureReferenceCollectionExists() {
  const collectionExists = await doesReferenceCollectionExist();

  if (!collectionExists) {
    const referencePapers = await repository.getReferencePapers();

    await seedReferencePapers(referencePapers); // paranoid seeding
  }
}
