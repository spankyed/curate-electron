import calendarController from './web/calendar';
import paperEntryController from './web/paper-entry';
import dateEntryController from './web/date-entry';
import searchController from './web/search';
import sharedController from './web/shared';
import chatController from './web/chat';
import backfill from './web/backfill';
import onboard from './web/onboard';

import scrape from './worker/scrape';

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
