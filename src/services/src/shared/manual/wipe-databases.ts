import * as sharedRepository from '@services/shared/repository';
import { synchronizeDatabase } from './migration';
import { setConfigSettings } from '@services/shared/utils/set-config';

synchronizeDatabase();

await sharedRepository.chroma.deleteReferenceCollection()

await setConfigSettings({ isNewUser: true })


