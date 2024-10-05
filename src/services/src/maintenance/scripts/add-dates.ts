import repository from '../repository';
import { setConfigSettings } from '@services/shared/utils/set-config';
import { Config } from '@services/shared/utils/get-config';

// usage: backfill from current date to May 1, 2023
// backfillDates('2023-05-01');

type DateParam = string | Date;

// ? Returns either an interface including  all records or only a list of new date values
export async function backfillDates(startDate: DateParam, endDate?: DateParam) {
  const to = endDate || new Date();
  const from = new Date(startDate);
  const datesToBackfill = getDatesBetween(from, to);
  const newRecords = await repository.storeDates(datesToBackfill);

  console.log('Backfill completed.');

  return newRecords;
};

export function getDatesBetween(startDate: DateParam, endDate: DateParam): string[] {
  const dates: string[] = [];
  const to = new Date(endDate);
  let from = new Date(startDate);

  // Reset from time to avoid timezone issues
  // ! revisit this logic for handling timezones
  from = new Date(from.setHours(0, 0, 0, 0));
  const endUTC = new Date(to.setHours(0, 0, 0, 0));

  while (from <= endUTC) {
    dates.push(from.toISOString().split('T')[0]);
    const nextDate = new Date(from.setDate(from.getDate() + 1))
    from = nextDate;
  }

  return dates;
}

export function getCurrentDate() {
  const date = new Date();
  return new Date(date.setHours(0, 0, 0, 0)).toISOString().split('T')[0];
}

export function backfillInitialDates() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;

  const startOfPreviousYear = new Date(previousYear, 0, 1);
  const today = new Date(currentDate.setHours(0, 0, 0, 0));

  return backfillDates(startOfPreviousYear, today);
}


// export function getDateNDaysBack(n: string) {
//   const date = new Date();
//   const pastDate = new Date(date.setDate(date.getDate() - Number(n)));
//   return new Date(pastDate.setHours(0, 0, 0, 0)).toISOString().split('T')[0];
// }
8