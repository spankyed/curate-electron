// import eventHandlers from './service/handlers/socket';

import calendarController from './web/calendar';
import paperEntryController from './web/paper-entry';
import dateEntryController from './web/date-entry';
import searchController from './web/search';
import sharedController from './web/shared';
import chatController from './web/chat';

// import type { Paper } from './web/search/repository';
// import type { Paper } from '@services/search/repository';

// import mocks from '../../../tests/mocks';
// const { calendarModel } = mocks;

export default {
  ...calendarController,
  ...paperEntryController,
  ...dateEntryController,
  ...searchController,
  ...sharedController,
  ...chatController,
}

export const io: any = {};

// export const io = new IOServer(null, {
//   cors: {
//     origin: ClientPath,
//     methods: ["GET", "POST"],
//     // allowedHeaders: ["my-custom-header"],
//     // credentials: true // Allow sending cookies from the client
//   }
// });

// export let user = '';

(async function start () {
  // Object.keys(eventHandlers).forEach((event) => {
  //   const handler = eventHandlers[event as keyof typeof eventHandlers] || (() => {});
  //   socket.on(event, handler);
  // });


  console.log('Web service running',);
})();
