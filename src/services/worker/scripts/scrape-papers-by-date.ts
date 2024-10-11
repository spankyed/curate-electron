import axios from 'axios';
import { PaperRecord } from '@services/shared/types';
import { extractPaperData } from '@services/shared/utils/extract-paper-data';

const ARXIV_API_ENDPOINT = 'https://export.arxiv.org/api/query?';
const maxResults = 1000;

const createArxivQuery = (dateString: string): string => {
  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateString.match(dateRegex);

  if (!match) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD.');
  }

  const [year, month, day] = match.slice(1);
  const formattedDate = `${year}${month}${day}`;

  return `search_query=cat:cs.AI+AND+submittedDate:[${formattedDate}0000+TO+${formattedDate}2359]&start=0&max_results=${maxResults}`;
};

export default async function scrapePapersByDate(date: string): Promise<PaperRecord[]> {
  try {
    const query = createArxivQuery(date);
    const url = ARXIV_API_ENDPOINT + query;
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error('Error fetching data from ArXiv API endpoint');
    }

    return extractPaperData(response.data, { date });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Example usage
// scrapePapersByDate('2024-02-21').then(papers => {
//   console.log(papers);
// }).catch(error => {
//   console.error('Error fetching papers:', error);
// });
