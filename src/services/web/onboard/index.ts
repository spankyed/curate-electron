import * as sharedRepository from '@services/shared/repository';
import { seedReferencePapers } from './seed-reference-papers';
import { setConfigSettings } from '@services/shared/utils/set-config';

async function onboardNewUser(form) {
  const { config } = form;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  await Promise.all([
    sharedRepository.getDatesByYear(currentYear.toString()),
    sharedRepository.chroma.initializeReferenceCollection(),
  ]);

  setConfigSettings({ ...config, isNewUser: false });

  // runBackgroundScripts();

  return 'onboarding complete';
}

async function addInitialReferences(form) {
  const { inputIds } = form;

  if (inputIds?.length) {
    await seedReferencePapers(undefined, inputIds);
  }

  return 'References seeded!';
}

export default {
  // onboarding
  'add-initial-references': addInitialReferences,
  'onboard-new-user': onboardNewUser,
};
