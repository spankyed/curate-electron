// import * as sharedRepository from '@services/shared/repository';
import { synchronizeDatabase } from './migration';
import { resetStore } from './set-store';

synchronizeDatabase();

// await sharedRepository.chroma.deleteReferenceCollection();

resetStore();
