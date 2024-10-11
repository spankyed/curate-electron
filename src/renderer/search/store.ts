import { atom } from 'jotai';
import type { Paper } from '@renderer/shared/utils/types';
import * as api from '@renderer/shared/api/fetch';
import type dayjs from 'dayjs'; // Import dayjs if you haven't already
import { addAlertAtom, addSnackAtom } from '@renderer/shared/components/notification/store';

export const searchStateAtom = atom<'pending' | 'loading' | 'complete' | 'empty' | 'error'>(
  'pending'
);
export const tabValueAtom = atom<'table' | 'grid'>('table');
export const resultListAtom = atom<Paper[]>([]);

export const queryAtom = atom('');
export const queryFieldAtom = atom('all');
export const favoriteAtom = atom(false);
export const viewedAtom = atom(false);
export const relevancyAtom = atom('');
export const comparisonOperatorAtom = atom('≥');
export const dateStartAtom = atom<Day>(null);
export const dateEndAtom = atom<Day>(null);

export const initialStateAtom = atom(false);
export const approvedStateAtom = atom(false);
export const generatedStateAtom = atom(false);
export const publishedStateAtom = atom(false);

type Day = dayjs.Dayjs | null;
type Form = {
  query?: string;
  queryField?: string;
  relevancy?: {
    operator: string;
    value: string;
  };
  dateStart?: string;
  dateEnd?: string;
  viewed?: boolean;
  favorite?: boolean;
  initialState?: boolean;
  approvedState?: boolean;
  generatedState?: boolean;
  publishedState?: boolean;
};

export const submitSearchAtom = atom(null, async (get, set, formInput?: Form) => {
  set(searchStateAtom, 'loading');

  const beforeDate = get(dateStartAtom) as unknown as Day;
  const afterDate = get(dateEndAtom) as unknown as Day;

  const form = formInput || {
    query: get(queryAtom), // string
    queryField: get(queryFieldAtom), // string
    relevancy: {
      operator: get(comparisonOperatorAtom), // string
      value: get(relevancyAtom), // string
    },
    dateStart: beforeDate ? beforeDate.format('YYYY-MM-DD') : null, // string
    dateEnd: afterDate ? afterDate.format('YYYY-MM-DD') : null, // string
    viewed: get(viewedAtom), // boolean
    favorite: get(favoriteAtom), // boolean
    initialState: get(initialStateAtom), // boolean
    approvedState: get(approvedStateAtom), // boolean
    generatedState: get(generatedStateAtom), // boolean
    publishedState: get(publishedStateAtom), // boolean
  };

  try {
    const results = await api.searchPapers(form);

    if (results.length === 1000) {
      set(addAlertAtom, {
        message: 'Results limited to 1000 papers. Please refine your search criteria.',
        autoClose: true,
      });
    }

    if (results.length === 0) {
      set(searchStateAtom, 'empty');
    } else {
      set(searchStateAtom, 'complete');
    }

    set(resultListAtom, results as any);
  } catch (error) {
    console.error('Failed to search papers:', error);
    set(searchStateAtom, 'error');
  }
});

export const resetFieldsAtom = atom(null, (get, set) => {
  set(queryAtom, '');
  set(queryFieldAtom, 'all');
  set(favoriteAtom, false);
  set(viewedAtom, false);
  set(relevancyAtom, '');
  set(comparisonOperatorAtom, '≥');
  set(dateStartAtom, null);
  set(dateEndAtom, null);
  set(initialStateAtom, false);
  set(approvedStateAtom, false);
  set(generatedStateAtom, false);
  set(publishedStateAtom, false);
});
