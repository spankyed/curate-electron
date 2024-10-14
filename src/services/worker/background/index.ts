import { ensureReferenceCollectionExists } from './ensure-reference-collection';
// import { scrapeBatch } from "../scripts/scrape-batch";
import { startJobScrapeNewDatesWithRetry } from './cron-jobs';
import { getSetting } from '@services/shared/settings';

async function runBackgroundScripts() {
  const isNewUser = getSetting('isNewUser');

  if (isNewUser) {
    return;
  }

  ensureReferenceCollectionExists();

  startJobScrapeNewDatesWithRetry();

  console.log('Background scripts running.');
}

export default runBackgroundScripts;
