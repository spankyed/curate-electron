import repository from '../repository';
import * as sharedRepository from '@services/shared/repository';
import { scrapeBatch } from '../scripts/scrape-batch';
import { backfillInitialDates, backfillDates } from "../scripts/add-dates";
import { groupDatesByMonth } from '@services/web/shared/transform';
import { seedReferencePapers } from "../scripts/seed-reference-papers";
import { setConfigSettings } from "@services/shared/utils/set-config";
import runBackgroundScripts from "../background";

async function getBatchDates(cursor, direction) {
  const dates = await repository.getBackfillDates({ cursor, direction, count: 45 });

  return dates
}

async function loadBatchDates(start, end) {
  const newDateRecords = await backfillDates(start, end);
  const dates = await repository.getPendingDatesBetween(start, end);

  return dates
}

async function batchScrape(dates) {
  scrapeBatch(dates)

  return 'batch scraping started!';
}

async function onboardNewUser(form) {
  const { config } = form;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  await Promise.all([
    sharedRepository.getDatesByYear(currentYear.toString()),
    sharedRepository.chroma.initializeReferenceCollection()
  ])

  setConfigSettings({...config, isNewUser: false })

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
  'load-batch-dates': loadBatchDates,
  'get-batch-dates': getBatchDates,
  'scrape-batch': batchScrape,
  // onboarding
  'add-initial-references': addInitialReferences,
  'onboard-new-user': onboardNewUser,
}
