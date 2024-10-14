import * as sharedRepository from '@services/shared/repository';
import { synchronizeDatabase } from './migration';
import { setSetting } from '../settings';

synchronizeDatabase();

await sharedRepository.chroma.deleteReferenceCollection();

setSetting('isNewUser', true);
