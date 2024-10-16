// https://blog.theodo.com/2022/07/simplify-your-applications-with-xstate/
// https://www.youtube.com/watch?v=qqyQGEjWSAw
// import * as fs from 'fs';
// import repository from './repository';
import * as sharedRepository from '@services/shared/repository';
import { notifyClient } from '@services/shared/status';
import { getRelevancyScores } from './relevancy-compute';
import scrapePapersByDate from './scrape-papers-by-date';

const scrapeAndRankPapers = async (date: string, alwaysNotify = true) => {
  try {
    console.log('Scraping papers...', date);
    sharedRepository.updateDate(date, { status: 'scraping' });
    notifyClient({ key: date, status: 'scraping' }, alwaysNotify);

    const papers = await scrapePapersByDate(date);

    if (papers.length === 0) {
      throw new Error('No papers found after scraping');
    }

    console.log('Ranking papers...', date);
    sharedRepository.updateDate(date, { status: 'ranking' });
    notifyClient({ key: date, status: 'ranking' }, alwaysNotify);

    const rankedPapers = await getRelevancyScores(papers);
    const paperRecords = rankedPapers.sort((a, b) => b.relevancy - a.relevancy);

    console.log('Storing papers in DB...', date);

    try {
      Promise.all([
        sharedRepository.storePapers(paperRecords),
        sharedRepository.updateDate(date, { status: 'complete', count: paperRecords.length }),
      ]);
    } catch (error) {
      console.error(`Error storing papers: ${date}`, error);

      throw error;
    }

    notifyClient({ key: date, status: 'complete', data: paperRecords, final: true }, alwaysNotify);

    console.log('Scraped, ranked, and stored papers for:', date);

    return paperRecords;
  } catch (error) {
    console.error('Error scraping/ranking papers for:', date);

    // sharedRepository.updateDate(date, 'error')
    sharedRepository.updateDate(date, { status: 'pending' });
    notifyClient({ key: date, status: 'error', data: [], final: true }, alwaysNotify);

    // throw error
    return [];
  }
};

export default scrapeAndRankPapers;
