import * as sharedRepository from '../shared/repository';
import * as repository from './repository';

export default {
  'get-date-entry': getDateEntry,
}

async function getDateEntry(dateId){
  const [date, papers] = await Promise.all([
    repository.getDateByValue(dateId),
    sharedRepository.getPapersByDates([dateId]),
  ]);
  return { papers, date }
}
