// import * as repository from './repository';
import * as sharedRepository from '@services/shared/repository';
import { groupDatesByMonth } from './transform';
import { getSetting } from '@services/shared/settings';

async function checkIsNewUser() {
  const isNewUser = getSetting('isNewUser');

  return isNewUser;
}

async function getDatesByYear(year) {
  const dates = await sharedRepository.getDatesByYear(year);
  const dateList = groupDatesByMonth(dates);

  return dateList;
}

export default {
  'check-is-new-user': checkIsNewUser,
  'get-dates-by-year': getDatesByYear,
};
