import scrapeAndRankPapers from '../scripts/scrape';

async function scrapePapers(date) {
  scrapeAndRankPapers(date);

  return { message: 'Scraping started!' };
}

export default {
  'scrape-papers': scrapePapers,
};
