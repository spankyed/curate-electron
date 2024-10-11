import { atom } from 'jotai';
import * as api from '@renderer/shared/api/fetch';
import { setSidebarDataAtom } from '@renderer/shared/components/layout/sidebar/dates/store';
import { selectedDateAtom } from '@renderer/shared/store';
import dayjs from 'dayjs';
import { addSnackAtom } from '@renderer/shared/components/notification/store';
import { batchDatesAtom, batchStateAtom, getDatesAtom } from '../batch-scrape/store';

export const backfillStateAtom = atom<'pending' | 'loading'>('pending');

type Day = dayjs.Dayjs | null;
// export const startDateAtom = atom<Day>(dayjs().subtract(30, 'days'));
export const dateStartAtom = atom(<Day>null);
export const dateEndAtom = atom<Day>(null);

export const loadDatesAtom = atom(
  null, // write-only atom
  async (get, set, changed, date: Day) => {
    set(backfillStateAtom, 'loading');
    try {
      // todo limit batch dates to 730 days
      const dateRange = {
        start: get(dateStartAtom)?.format('YYYY-MM-DD'),
        end: get(dateEndAtom)?.format('YYYY-MM-DD'),
      };

      if (changed === 'start') {
        dateRange.start = date?.format('YYYY-MM-DD');

        set(dateStartAtom, date);
      } else {
        dateRange.end = date?.format('YYYY-MM-DD');

        set(dateEndAtom, date);
      }

      const dates = await api.loadBatchDates(dateRange.start, dateRange.end);
      console.log('dates: ', dates);

      // set(setSidebarDataAtom, dateList);

      set(
        batchDatesAtom,
        dates.map((d) => ({
          value: d.value,
          status: d.status,
        }))
      );

      set(backfillStateAtom, 'pending');

      // set(addSnackAtom, { message: `Added ${newCount} dates`, autoClose: true });
    } catch (error) {
      console.error('Failed to backfill data', error);
      // set(calendarStateAtom, 'error');
    }
  }
);
