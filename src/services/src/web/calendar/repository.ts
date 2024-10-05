import { DatesTable, PapersTable } from "../../shared/schema";
import { Sequelize, DataTypes, Op, FindOptions } from 'sequelize';

export const calendarPageSize = 5;

type CalendarData = [DatesTable[], PapersTable[]];

async function fetchCalendarData(beforeDate?: string, include: boolean = false): Promise<CalendarData> {
  let queryOptions: FindOptions = {
    raw: true,
    order: [['value', 'DESC']],
    limit: calendarPageSize,
    // attributes: ['value'], // if we only need the 'value' field for the join
  };

  if (beforeDate) {
    // If a cursor is provided, adjust the query to fetch records after the cursor
    queryOptions.where = {
      value: {
        [include ? Op.lte : Op.lt]: beforeDate,
      },
    };
  }

  const recentDates = await DatesTable.findAll(queryOptions);

  const recentDateValues = recentDates.map(date => date.value);

  const papersWithDates = await PapersTable.findAll({
    include: [{
      model: DatesTable,
      where: { value: { [Op.in]: recentDateValues } }, // Use [Op.in] for matching any value in the array
      // where: { value: recentDateValues }, // Filters the PapersTable entries to those that match the recent dates
    }],
    order: [['date', 'DESC']], // Ensures papers are sorted by their date
  });

  return [recentDates, papersWithDates];
}

export {
  fetchCalendarData,
}

/**
 * Fetches a page of papers sorted by date for cursor-based pagination.
 * 
 * @param {string|null} lastDateCursor The last date fetched, used as a cursor for pagination. Null for the first page.
 * @param {number} pageSize The number of records to fetch.
 * @param {boolean} [desc=true] Whether to sort in descending order. Default is true.
 * @returns {Promise<Array>} A promise that resolves to an array of papers.
 */
// async function fetchPapersByDate(lastDateCursor: any, pageSize: any, desc = true) {
//   let queryOptions: FindOptions = {
//     raw: true,
//     order: [['date', desc ? 'DESC' : 'ASC']],
//     limit: pageSize,
//     // attributes: ['value'], // if we only need the 'value' field for the join
//   };

//   if (lastDateCursor) {
//     queryOptions.where = {
//       date: {
//         [desc ? Op.lt : Op.gt]: lastDateCursor,
//       },
//     };
//   }

//   return await PapersTable.findAll(queryOptions);
// }
