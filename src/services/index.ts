import calendarController from './api/calendar';
import paperEntryController from './api/paper-entry';
import dateEntryController from './api/date-entry';
import searchController from './api/search';
import sharedController from './api/shared';
import chatController from './api/chat';
import backfill from './api/backfill';
import onboard from './api/onboard';

import scrape from './worker/scrape-rank';

// import mocks from '../../../tests/mocks';
// const { calendarModel } = mocks;

export default {
  ...calendarController,
  ...paperEntryController,
  ...dateEntryController,
  ...searchController,
  ...sharedController,
  ...chatController,
  ...backfill,
  ...onboard,

  // worker
  ...scrape,
};

// export const workers = {
//   scrape,
// };
