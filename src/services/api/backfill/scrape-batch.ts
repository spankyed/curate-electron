import { runScrapeAndRank } from '@services/worker/scrape-rank';
import repository from '../onboard/repository';
import { updateWorkStatus } from '@services/core/status';
import { DateStatuses } from '@services/core/types';

// Track active batch scraping processes
const activeBatchProcesses = new Set<string>();

export async function scrapeBatch(dates?: string[]) {
  if (!dates || dates.length === 0) {
    return;
  }

  // const results = [];
  const parallelBatchSize = 3;

  const completedDates = await repository.getDates(dates, 'complete');
  // results.push(...completedDates);
  const pendingDates = dates.filter((date) => !completedDates.map((d) => d.value).includes(date));

  // Add dates to active batch processes
  for (const date of pendingDates) {
    activeBatchProcesses.add(date);
  }

  for (let i = 0; i < pendingDates.length; i += parallelBatchSize) {
    const batch = pendingDates.slice(i, i + parallelBatchSize);

    try {
      await Promise.all(
        batch.map(async (date) => {
          if (!activeBatchProcesses.has(date)) {
            return null; // Skip if cancelled
          }
          return runScrapeAndRank(date);
        })
      );
      // results.push(...batchResults);
    } catch (error) {
      // Log the error and possibly decide whether to continue with the next batch
      console.error(`Error processing batch starting at index ${i}:`, error);
      // Continue processing the rest of the batches even if one fails
    }
  }

  // Clear active batch processes
  for (const date of pendingDates) {
    activeBatchProcesses.delete(date);
  }

  // updateWorkStatus({ key: 'backfill', status: 'complete' });
  updateWorkStatus({ key: 'batch', status: DateStatuses.COMPLETE });
  // return results;
}

export function cancelBatchScraping() {
  activeBatchProcesses.clear();
  return { message: 'Batch scraping cancelled!' };
}
