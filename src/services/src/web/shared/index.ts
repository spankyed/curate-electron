import { io } from "../..";
// import * as repository from './repository';
import * as sharedRepository from '@services/shared/repository';
import { groupDatesByMonth } from "./transform";
import { getConfig } from "@services/shared/utils/get-config";
import { WorkerPath } from "../../shared/constants";
import createRequest from "../../shared/request";

const workerService = createRequest(WorkerPath);
// const maintenanceService = createRequest(MaintenancePath);

// async function gateway(method: string){
//   return async (request: any, h: any) => {
//     try {
//       const result: any = await maintenanceService.post(method, request.payload);
//       return result;
//     } catch (err) {
//       console.error('Error in gateway: ', err);
//       return
//     }
//   }
// }

async function updateStatus(type, { key, status, data, final }) {
  console.log('updateStatus: ', {type, key, status, data: !!data, final});

  // type Status = { current: string; updated?: boolean; final?: boolean; data?: any };
  // io.to(user).emit('status', { type, key, status, data, final });
  io.emit('date_status', { type, key, status, data, final });

  return 'success';
}

async function checkIsNewUser(){
  const config = await getConfig();
  const isNewUser = config.settings.isNewUser;

  return isNewUser;
}

async function getDatesByYear(year){
  const dates = await sharedRepository.getDatesByYear(year);
  const dateList = groupDatesByMonth(dates);

  return dateList;
}

async function scrapePapers(date){
  workerService.post('scrape', { date });

  return 'Scraping started';
}

export default {
  'check-is-new-user': checkIsNewUser,
  'update-work-status': updateStatus,
  'get-dates-by-year': getDatesByYear,
  'scrape-date': scrapePapers,
}

// export default [
//   route.post('/scrapeBatch', gateway('scrapeBatch')),
//   route.post('/getBatchDates', gateway('getBatchDates')),
//   route.post('/loadBatchDates', gateway('loadBatchDates')),
//   route.post('/onboardNewUser', gateway('onboardNewUser')),
//   route.post('/addInitialReferences', gateway('addInitialReferences')),

// ]
