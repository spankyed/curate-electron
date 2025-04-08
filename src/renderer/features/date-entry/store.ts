import { atom } from 'jotai';
import * as api from '@renderer/core/api/fetch';

export const tabValueAtom = atom<'table' | 'grid'>('table');
export const searchKeywordAtom = atom('');
export const scrapingStateAtom = atom<'pending' | 'scraping' | 'ranking' | 'complete'>('pending');
export const dateEntryStateAtom = atom<'loading' | 'pending' | 'complete' | 'error' | 'unexpected'>(
  'loading'
);
export const dateEntryPapersAtom = atom<any[]>([]);

export const filteredPapersAtom = atom(
  (get) => {
    const papers = get(dateEntryPapersAtom);
    const keyword = get(searchKeywordAtom).toLowerCase();

    if (!keyword.trim()) return papers; // Return all papers if search is empty

    return papers.filter((paper) => {
      return (
        paper.title.toLowerCase().includes(keyword) ||
        paper.abstract.toLowerCase().includes(keyword) ||
        paper.authors.split(';').some((author) => author.toLowerCase().includes(keyword))
      );
    });
  },
  async (get, set, papers: any) => {
    set(dateEntryPapersAtom, papers);
  }
);

export const fetchPapersByDateAtom = atom(null, async (get, set, dateId: string) => {
  if (!dateId) {
    console.error('Date not found', dateId);
    return;
  }

  set(dateEntryStateAtom, 'loading');

  try {
    const model = await api.getDateEntryModel(dateId);
    const { date, papers } = model;

    if (!date) {
      throw new Error('Date not found');
    }

    if (date.status === 'complete' && papers.length === 0) {
      console.error('No papers found when fetching by date');
      set(dateEntryStateAtom, 'error');
    } else {
      set(dateEntryPapersAtom, papers);
      set(dateEntryStateAtom, date.status);
    }
  } catch (error) {
    console.error('Failed to fetch papers for date', error);
    set(dateEntryStateAtom, 'error');
  }
});

export const scrapePapersDateEntryAtom = atom(null, async (get, set, dateId: string) => {
  try {
    set(scrapingStateAtom, 'scraping');

    await api.scrapeDate(dateId);
  } catch (error) {
    console.error('Scraping failed:', error);
    set(scrapingStateAtom, 'pending');
    set(dateEntryStateAtom, 'error');
  }
});

export const resetDateEntryStatusAtom = atom(null, async (get, set, dateId: string) => {
  try {
    const { data: success } = await api.resetDateStatus(dateId);
    if (!success) {
      return;
    }

    set(dateEntryStateAtom, 'pending');
    set(scrapingStateAtom, 'pending');
  } catch (error) {
    console.error('Failed to reset date status', error);
    set(dateEntryStateAtom, 'error');
  }
});
