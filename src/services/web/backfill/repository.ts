import { type FindOptions, Op } from 'sequelize';
import { DatesTable, PapersTable, ReferencePapersTable } from '../../shared/schema'

type getBackfillDateParams = {
  cursor: string | undefined;
  direction: 'left' | 'right';
  count?: number;
};

function getBackfillDates(params: getBackfillDateParams): Promise<DatesTable[]> {
  const { cursor, direction, count } = params
  const isRight = !direction || direction === 'right'
  const queryOptions: FindOptions<DatesTable> = {
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
  }

  return DatesTable.findAll(queryOptions)
    .then((results) => {
      // If direction is left, reverse the results to maintain ascending order
      if (!isRight) {
        results.reverse()
      }
      return results
    })
    .catch((error) => {
      console.error('Error fetching dates:', error)
      throw error // Properly propagate errors
    })
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

export {
  getBackfillDates,
  getPendingDatesBetween
}
