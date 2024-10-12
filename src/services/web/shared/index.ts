import { io } from '../..';
// import * as repository from './repository';
import * as sharedRepository from '@services/shared/repository';
import { groupDatesByMonth } from './transform';
import { WorkerPath } from '../../shared/constants';
import createRequest from '../../shared/request';
import { getSetting } from '@services/shared/utils/config-store';

const workerService = createRequest(WorkerPath);

async function updateStatus(type, { key, status, data, final }) {
  console.log('updateStatus: ', { type, key, status, data: !!data, final });

  // type Status = { current: string; updated?: boolean; final?: boolean; data?: any };
  // io.to(user).emit('status', { type, key, status, data, final });
  io.emit('date_status', { type, key, status, data, final });

  return 'success';
}

async function checkIsNewUser() {
  const isNewUser = getSetting('isNewUser');

  return isNewUser;
}

async function getDatesByYear(year) {
  const dates = await sharedRepository.getDatesByYear(year);
  const dateList = groupDatesByMonth(dates);

  return dateList;
}

async function scrapePapers(date) {
  workerService.post('scrape', { date });

  return 'Scraping started';
}

export default {
  'check-is-new-user': checkIsNewUser,
  'update-work-status': updateStatus,
  'get-dates-by-year': getDatesByYear,
  'scrape-date': scrapePapers,
};
