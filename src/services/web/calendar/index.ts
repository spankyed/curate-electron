import * as repository from './repository';
import * as sharedRepository from '../../shared/repository';
import { mapRecordsToModel } from './transform';

async function getCalendar() {
  const [prevFiveDates, papers] = await repository.fetchCalendarData();
  const calendarModel = mapRecordsToModel(prevFiveDates, papers);
  // ! this being empty shouldn't break the UI for papers in calendar
  return calendarModel;
}

async function loadMore(cursor) {
  const date = cursor;
  const [prevFiveDates, papers] = await repository.fetchCalendarData(date);
  const calendarModel = mapRecordsToModel(prevFiveDates, papers);
  return calendarModel;
}

async function loadMonth(cursor) {
  const date = cursor;
  const [prevFiveDates, papers] = await repository.fetchCalendarData(date, true);
  const calendarModel = mapRecordsToModel(prevFiveDates, papers);
  return calendarModel;
}

async function reset(date) {
  const success = await sharedRepository.updateDate(date, { status: 'pending' });
  return success;
}

export default {
  'get-calendar': getCalendar,
  'load-more': loadMore,
  'load-month': loadMonth,
  reset,
};
