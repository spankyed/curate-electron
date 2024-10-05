import { atom } from 'jotai';
import * as api from '@renderer/shared/api/fetch';
import { selectedDateAtom } from '@renderer/shared/store';
import { CalendarModel, DateRow } from '@renderer/shared/utils/types';
import { RefObject } from 'react';
import { resetDateStatus } from '../shared/api/fetch';
import { splitAtom } from 'jotai/utils'

export const calendarStateAtom = atom<'loading' | 'backfill' | 'ready' | 'error'>('loading');
export const lastRecordReachedAtom = atom(false);
export const calendarModelAtomBase = atom<CalendarModel>([]);
export const calendarModelAtom = splitAtom(calendarModelAtomBase);

export const fetchCalendarModelAtom = atom(
  null,
  async (get, set) => {
    try {
      set(calendarStateAtom, 'loading');
      set(lastRecordReachedAtom, false);

      const response = await api.getCalendarModelData();
      const calendarModel = response.data as CalendarModel;
      console.log('Calendar Model: ', calendarModel);
      set(calendarModelAtomBase, calendarModel);

      const hasDates = calendarModel.length > 0;
      set(calendarStateAtom, hasDates ? 'ready' : 'backfill');
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
    } catch (error) {
      console.error("Failed to fetch calendar", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const calendarLoadMoreAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    try {
      // set(calendarStateAtom, 'loading');
      set(lastRecordReachedAtom, false);

      const response = await api.calendarLoadMore(date);
      const calendarModel = response.data as CalendarModel;
      set(calendarModelAtomBase, [...get(calendarModelAtomBase), ...calendarModel]);

      if (calendarModel.length === 0) {
        set(lastRecordReachedAtom, true);
      }

      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
      // set(calendarStateAtom, 'ready');
    } catch (error) {
      console.error("Failed to load more calendar dates", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const calendarLoadMonthAtom = atom(
  null, // write-only atom
  async (get, set, date) => {
    // set(calendarStateAtom, 'loading');
    set(lastRecordReachedAtom, false);

    try {
      const response = await api.calendarLoadMonth(date);
      const calendarModel = response.data as CalendarModel;
      set(calendarModelAtomBase, calendarModel);
      set(calendarStateAtom, 'ready');
      // set(selectedDateAtom, dateList[0]?.dates[0]?.value ?? '');
    } catch (error) {
      console.error("Failed to load more calendar dates", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const resetDateStatusCalenderAtom = atom(
  null,
  async (get, set, date) => {
    try {
      const { data: success } = await resetDateStatus(date);
      if (!success) {
        return;
      }

      const calendar = get(calendarModelAtomBase);
      const index = calendar.findIndex((d) => d.date.value === date);

      if (index === -1) {
        return;
      }

      // Clone the item to mutate
      const updatedItem = { ...calendar[index] };
      updatedItem.date.status = 'pending';

      // Use a functional update to only modify the item that has changed
      set(calendarModelAtomBase, (prev) => [
        ...prev.slice(0, index),
        updatedItem,
        ...prev.slice(index + 1),
      ]);
    } catch (error) {
      console.error("Failed to reset date status", error);
      set(calendarStateAtom, 'error');
    }
  }
);

export const scrapePapersAtom = atom(
  null,
  async (get, set, value) => {
    const dateAtoms = get(calendarModelAtom);

    let targetDateAtom = dateAtoms.find((dateAtom) => {
      const { date } = get(dateAtom);
      return date.value === value;
    });

    if (!targetDateAtom) {
      console.error("Date not found", value);
      return;
    }

    try {
      set(targetDateAtom, (prevDate) => ({ ...prevDate, date: { ...prevDate.date, status: 'scraping' } }));

      await api.scrapeDate(value);

    } catch (error) {
      console.error("Scraping failed:", error);
      set(targetDateAtom, (prevDate) => ({ ...prevDate, date: { ...prevDate.date, status: 'error' } }));
    }
  }
);

export const scrollableContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(null);

export const updatePaperInCalenderAtom = atom(
  null,
  async (get, set, { date: value, id, changes }) => {
    const dateAtoms = get(calendarModelAtom);

    let targetDateAtom = dateAtoms.find((dateAtom) => {
      const { date } = get(dateAtom);
      return date.value === value;
    });

    if (!targetDateAtom) {
      return;
    }

    const { field, value: newValue } = changes;

    set(targetDateAtom, (prevDate) => ({
      ...prevDate,
      papers: prevDate.papers.map(item =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    }));
  }
);
