import * as sharedRepository from '@services/shared/repository';
import { updateWorkStatus } from '@services/shared/status';
import scrapePapersByDate from './scrape-papers-by-date';
import spawnRankingProcess from './spawn-fork';

export const scrapeAndRankPapers = async (date, alwaysNotify = true) => {
  try {
    console.log('Scraping papers...', date);
    sharedRepository.updateDate(date, { status: 'scraping' });
    updateWorkStatus({ key: date, status: 'scraping' }, alwaysNotify);

    const papers = await scrapePapersByDate(date);

    if (papers.length === 0) {
      throw new Error('No papers found after scraping');
    }

    console.log('Ranking papers...', date);
    sharedRepository.updateDate(date, { status: 'ranking' });
    updateWorkStatus({ key: date, status: 'ranking' }, alwaysNotify);

    // Use the worker thread for getRelevancyScores
    const rankedPapers = await spawnRankingProcess(papers);
    console.log('rankedPapers: ', rankedPapers);
    const paperRecords = rankedPapers.sort((a, b) => b.relevancy - a.relevancy);

    console.log('Storing papers in DB...', date);

    try {
      await Promise.all([
        sharedRepository.storePapers(paperRecords),
        sharedRepository.updateDate(date, { status: 'complete', count: paperRecords.length }),
      ]);
    } catch (error) {
      console.error(`Error storing papers: ${date}`, error);
      throw error;
    }

    updateWorkStatus(
      { key: date, status: 'complete', data: paperRecords, final: true },
      alwaysNotify
    );

    console.log('Scraped, ranked, and stored papers for:', date);

    return paperRecords;
  } catch (error) {
    console.error(`Error scraping/ranking papers for [${date}]:`, error?.message);
    sharedRepository.updateDate(date, { status: 'pending' });
    updateWorkStatus({ key: date, status: 'error', data: [], final: true }, alwaysNotify);
    return [];
  }
};

async function scrapePapers(date) {
  scrapeAndRankPapers(date);

  return { message: 'Scraping started!' };
}

export default {
  'scrape-date': scrapePapers,
};
