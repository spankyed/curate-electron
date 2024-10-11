import { getConfig } from '@services/shared/utils/get-config';
import { ensureReferenceCollectionExists } from './ensure-reference-collection';
// import { scrapeBatch } from "../scripts/scrape-batch";
import { startJobScrapeNewDatesWithRetry } from './cron-jobs';

async function runBackgroundScripts() {
  const config = await getConfig();
  const isNewUser = config.settings.isNewUser;

  if (isNewUser) {
    return;
  }

  ensureReferenceCollectionExists();

  startJobScrapeNewDatesWithRetry();

  console.log('Background scripts running.');
}

export default runBackgroundScripts;
