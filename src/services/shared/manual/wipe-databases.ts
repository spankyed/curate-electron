import * as sharedRepository from '@services/shared/repository';
import { synchronizeDatabase } from './migration';
import { setSetting } from '../utils/config-store';

synchronizeDatabase();

await sharedRepository.chroma.deleteReferenceCollection();

setSetting('isNewUser', true);
