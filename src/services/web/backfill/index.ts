import * as repository from './repository';
import { backfillDates } from "./add-dates";
import { scrapeBatch } from './scrape-batch';

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

export default {
  'load-batch-dates': loadBatchDates,
  'get-batch-dates': getBatchDates,
  'scrape-batch': batchScrape,
}
