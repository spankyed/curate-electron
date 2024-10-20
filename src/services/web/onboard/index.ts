import * as sharedRepository from '@services/shared/repository';
import { seedReferencePapers } from './seed-reference-papers';
import { getSetting, setSetting } from '@services/shared/settings';

async function onboardNewUser(form) {
  const { config } = form;
  // setSetting({ ...config, isNewUser: false });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  await Promise.all([
    sharedRepository.getDatesByYear(currentYear.toString()),
    // sharedRepository.chroma.initializeReferenceCollection(),
  ]);

  setSetting({ ...config, isNewUser: false });

  // runBackgroundScripts();

  return 'onboarding complete';
}

async function addInitialReferences(form) {
  const { inputIds } = form;

  if (inputIds?.length) {
    // await seedReferencePapers(undefined, inputIds);
  }

  return 'References seeded!';
}

async function getInitialReferenceIds() {
  const papersIds = getSetting('seedReferencesIds');

  return papersIds;
}

export default {
  // onboarding
  'get-initial-reference-ids': getInitialReferenceIds,
  'add-initial-references': addInitialReferences,
  'onboard-new-user': onboardNewUser,
};
