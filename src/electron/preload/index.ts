import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';

declare global {
  interface Window {
    api: {
      'load-batch-dates': (start, end) => Promise<any>;
      'get-batch-dates': (cursor: string | undefined, direction: string) => Promise<any>;
      'scrape-batch': (dates: Record<string, string>) => Promise<any>;

      'get-calendar': () => Promise<string>;
      'load-more': (cursor: string | undefined) => Promise<any>;
      'load-month': (cursor: string | undefined) => Promise<any>;
      reset: (date: string) => Promise<any>;

      // chat
      'initialize-chat': (paperId: string) => Promise<any>;
      'get-threads': (paperId: string) => Promise<any>;
      'get-messages': (threadId: string) => Promise<any>;
      'create-thread': (params: Record<string, string>) => Promise<any>;
      'branch-thread': (params: Record<string, string>) => Promise<any>;
      'toggle-hide-message': (params: Record<string, string>) => Promise<any>;
      'delete-message': (messageId: string) => Promise<any>;
      'send-message': (params: Record<string, string>) => Promise<any>;
      'stream-response': (params: Record<string, string>) => Promise<any>;
      'stop-message-stream': (threadId: string) => Promise<any>;
      'regenerate-response': (params: Record<string, string>) => Promise<any>;
      'update-api-keys': (params: Record<string, string>) => Promise<any>;
      'get-api-keys': () => Promise<any>;
      // paper
      'fetch-pdf': (paperId: string) => Promise<any>;
      'paper-by-id': (paperId: string) => Promise<any>;
      'star-paper': (paperId: string, value: boolean) => Promise<any>;
      'update-paper-status': (paperId: string, status: string) => Promise<any>;
      'get-date-entry': (date: string) => Promise<any>;
      'search-papers': (form: Record<string, string>) => Promise<any>;
      'check-is-new-user': () => Promise<any>;
      // onboarding
      'get-initial-reference-ids': () => Promise<any>;
      'add-initial-references': (form: Record<string, string>) => Promise<any>;
      'onboard-new-user': (form: Record<string, string>) => Promise<any>;
      // shared
      'get-dates-by-year': (year: number) => Promise<any>;
      'scrape-date': (date: string) => Promise<any>;
    };
    socket: {
      on: (channel, page: string, callback: () => void) => void;
      off: (channel, page: string) => void;
    };
  }
}

contextBridge.exposeInMainWorld('api', {
  'load-batch-dates': (start, end) => ipcRenderer.invoke('load-batch-dates', start, end),
  'get-batch-dates': (cursor, direction) =>
    ipcRenderer.invoke('get-batch-dates', cursor, direction),
  'scrape-batch': (dates) => ipcRenderer.invoke('scrape-batch', dates),

  'get-calendar': () => ipcRenderer.invoke('get-calendar'),
  'load-more': (cursor) => ipcRenderer.invoke('load-more', cursor),
  'load-month': (cursor) => ipcRenderer.invoke('load-month', cursor),
  reset: (date) => ipcRenderer.invoke('reset', date),

  // chat
  'initialize-chat': (paperId) => ipcRenderer.invoke('initialize-chat', paperId),
  'get-threads': (paperId) => ipcRenderer.invoke('get-threads', paperId),
  'get-messages': (threadId) => ipcRenderer.invoke('get-messages', threadId),
  'create-thread': (params) => ipcRenderer.invoke('create-thread', params),
  'branch-thread': (params) => ipcRenderer.invoke('branch-thread', params),
  'toggle-hide-message': (params) => ipcRenderer.invoke('toggle-hide-message', params),
  'delete-message': (messageId) => ipcRenderer.invoke('delete-message', messageId),
  'send-message': (params) => ipcRenderer.invoke('send-message', params),
  'stream-response': (params) => ipcRenderer.invoke('stream-response', params),
  'stop-message-stream': (threadId) => ipcRenderer.invoke('stop-message-stream', threadId),
  'regenerate-response': (params) => ipcRenderer.invoke('regenerate-response', params),
  'update-api-keys': (params) => ipcRenderer.invoke('update-api-keys', params),
  'get-api-keys': () => ipcRenderer.invoke('get-api-keys'),
  // paper
  'fetch-pdf': (paperId) => ipcRenderer.invoke('fetch-pdf', paperId),
  'paper-by-id': (paperId) => ipcRenderer.invoke('paper-by-id', paperId),
  'star-paper': (paperId, value) => ipcRenderer.invoke('star-paper', paperId, value),
  'update-paper-status': (paperId, status) =>
    ipcRenderer.invoke('update-paper-status', paperId, status),
  'get-date-entry': (date) => ipcRenderer.invoke('get-date-entry', date),
  'search-papers': (form) => ipcRenderer.invoke('search-papers', form),
  'check-is-new-user': () => ipcRenderer.invoke('check-is-new-user'),

  // onboarding
  'get-initial-reference-ids': () => ipcRenderer.invoke('get-initial-reference-ids'),
  'add-initial-references': (form) => ipcRenderer.invoke('add-initial-references', form),
  'onboard-new-user': (form) => ipcRenderer.invoke('onboard-new-user', form),
  // shared
  'get-dates-by-year': (year) => ipcRenderer.invoke('get-dates-by-year', year),
  'scrape-date': (date) => ipcRenderer.invoke('scrape-date', date),
});

type SocketCallback = (event: IpcRendererEvent, ...args) => void;
const callbackStore: { [channel: string]: { [page: string]: SocketCallback } } = {};

contextBridge.exposeInMainWorld('socket', {
  on: (channel: string, page: string, callback: SocketCallback) => {
    console.log(`Registering listener for channel: ${channel} on page: ${page}`);

    if (!callbackStore[channel]) {
      callbackStore[channel] = {};
    }
    callbackStore[channel][page] = callback;

    ipcRenderer.on(channel, callback);
  },
  off: (channel: string, page: string) => {
    console.log(`Removing listener for channel: ${channel} on page: ${page}`);

    const storedCallback = callbackStore[channel]?.[page];
    if (storedCallback) {
      ipcRenderer.off(channel, storedCallback);

      delete callbackStore[channel][page];

      if (Object.keys(callbackStore[channel]).length === 0) {
        delete callbackStore[channel];
      }
    } else {
      console.warn(`No listener found for channel: ${channel} on page: ${page}`);
    }
  },
});
