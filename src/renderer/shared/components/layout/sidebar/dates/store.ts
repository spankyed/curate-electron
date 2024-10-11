import dayjs from 'dayjs';
import { atom } from 'jotai';
import * as api from '@renderer/shared/api/fetch';
import type { DatesRow } from '@renderer/shared/utils/types';

export const currentYearAtom = atom(new Date().getFullYear());
export const datesRowsAtom = atom<DatesRow[]>([]);
export const openMonthAtom = atom('');
export const lastOpenMonthAtom = atom('');

export const setSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set, dateList: DatesRow[]) => {
    set(datesRowsAtom, dateList);
    set(openMonthAtom, dateList[0]?.month ?? '');
  }
);

export const fetchDatesSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set) => {
    // set(calendarStateAtom, 'loading');
    try {
      const currentYear = get(currentYearAtom);
      const dateList = await api.getSidebarDatesForYear(currentYear);
      console.log('Sidebar dates:', { dateList });
      set(setSidebarDataAtom, dateList);

      // set(calendarStateAtom, dateList.length > 0 ? 'ready' : 'backfill')
      // set(calendarStateAtom, 'selected');
    } catch (error) {
      console.error('Failed to fetch calendar', error);
      // set(calendarStateAtom, 'error');
    }
  }
);

export const updateSidebarDataAtom = atom(
  null, // write-only atom
  async (get, set, { key, count, status }) => {
    set(datesRowsAtom, (prevModel) => {
      const month = dayjs(key).format('MMMM YYYY');
      const updatedModel = prevModel.map((item) => {
        if (item.month === month) {
          return {
            ...item,
            dates: item.dates.map((date) => {
              if (date.value === key) {
                return {
                  ...date,
                  status,
                  count: count || undefined,
                };
              }
              return date;
            }),
          };
        }
        return item;
      });
      return updatedModel;
    });
  }
);
