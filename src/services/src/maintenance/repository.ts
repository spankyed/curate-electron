// Assuming PaperRecord matches the structure of your PapersTable model
import { FindOptions, Op } from 'sequelize';
import { DatesTable, PapersTable, ReferencePapersTable } from '../shared/schema';


// Fetch all stored dates
function getDates(dates: string[], status?: string) {
  return DatesTable.findAll({
    raw: true,
    where: {
      value: dates,
      ...(status && { status })
    }
  });
}

function getDate(date: string) {
  return DatesTable.findOne({
    where: {
      value: date
    }
  });
}

function getAllDates() {
  return DatesTable.findAll();
}

async function getLatestDate() {
  const lastDateRecord =  await DatesTable.findOne({
    order: [['value', 'DESC']]
  });


  return lastDateRecord ? lastDateRecord.value : null;
}

async function storeDate(date: string) {
  const existingDate = await DatesTable.findOne({
    where: {
      value: date
    }
  });

  if (!existingDate) {
    return await DatesTable.create({ value: date, status: 'pending' });
  } else {
    return existingDate;
  }
}

async function storeDates(dates: string[]): Promise<DatesTable[]> {
  const newDateRecords = dates.map(date => ({
    value: date,
    status: 'pending'
  }));

  let results: DatesTable[] = [];
  if (newDateRecords.length > 0) {
    results = await DatesTable.bulkCreate(newDateRecords, {
      ignoreDuplicates: true
    });
  }

  return results;
}

function storeReferencePapers(paperIds: string[]): Promise<any> {
  const referenceRecords = paperIds.map(id => ({ id }));

  return ReferencePapersTable.bulkCreate(
    referenceRecords,
    {
      ignoreDuplicates: true
    }
  );
}

async function getReferencePapers() {
  const paperIds = await ReferencePapersTable.findAll();

  return PapersTable.findAll({
    where: {
      id: paperIds
    }
  });
}

type getBackfillDateParams = {
  cursor: string | undefined;
  direction: 'left' | 'right';
  count?: number;
};

function getBackfillDates(params: getBackfillDateParams): Promise<DatesTable[]> {
  const { cursor, direction, count } = params;
  const isRight = !direction || direction === 'right';
  let queryOptions: FindOptions<DatesTable> = {
    raw: true,
    order: [['value', isRight ? 'ASC' : 'DESC']],
    limit: count || 45,
    where: {
      ...(cursor && {
        value: {
          [isRight ? Op.gt : Op.lt]: cursor
        }
      }),
      status: 'pending'
    }
  };

  return DatesTable.findAll(queryOptions)
    .then(results => {
      // If direction is left, reverse the results to maintain ascending order
      if (!isRight) {
        results.reverse();
      }
      return results;
    })
    .catch(error => {
      console.error('Error fetching dates:', error);
      throw error;  // Properly propagate errors
    });
}

async function getPendingDatesBetween(start: string, end: string) {
  console.log('end: ', end);
  console.log('start: ', start);
  return DatesTable.findAll({
    raw: true,
    order: [['value', 'ASC']],
    where: {
      value: {
        [Op.between]: [start, end]
      },
      status: 'pending'
    }
  });
}

export default {
  getDate,
  getDates,
  getAllDates,
  getLatestDate,
  storeDate,
  storeDates,
  storeReferencePapers,
  getReferencePapers,
  getBackfillDates,
  getPendingDatesBetween
};

