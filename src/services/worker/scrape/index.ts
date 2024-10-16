import scrapeAndRankPapers from './scrape-and-rank';

async function scrapePapers(date) {
  scrapeAndRankPapers(date);

  return { message: 'Scraping started!' };
}

export default {
  'scrape-papers': scrapePapers,
};
