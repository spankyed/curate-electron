// import * as sharedRepository from '@services/shared/repository';
import { setIsNewUser, synchronizeDatabase } from './migration';

synchronizeDatabase();

// await sharedRepository.chroma.deleteReferenceCollection();

setIsNewUser();
