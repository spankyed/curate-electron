import { contextBridge, ipcRenderer } from 'electron';

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

      'fetch-pdf': (paperId: string) => Promise<any>;
      'paper-by-id': (paperId: string) => Promise<any>;
      'star-paper': (paperId: string, value: boolean) => Promise<any>;
      'update-paper-status': (paperId: string, status: string) => Promise<any>;
      'get-date-entry': (date: string) => Promise<any>;
      'search-papers': (form: Record<string, string>) => Promise<any>;
      'check-is-new-user': () => Promise<any>;
      'update-work-status': (paperId: string, status: string) => Promise<any>;
      // onboarding
      'add-initial-references': (form: Record<string, string>) => Promise<any>;
      'onboard-new-user': (form: Record<string, string>) => Promise<any>;
      // shared
      'get-dates-by-year': (year: number) => Promise<any>;
      'scrape-date': (date: string) => Promise<any>;
    };
    socket: {
      on: (channel, callback: () => void) => void;
      off: (channel, callback: () => void) => void;
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

  'fetch-pdf': (paperId) => ipcRenderer.invoke('fetch-pdf', paperId),
  'paper-by-id': (paperId) => ipcRenderer.invoke('paper-by-id', paperId),
  'star-paper': (paperId, value) => ipcRenderer.invoke('star-paper', paperId, value),
  'update-paper-status': (paperId, status) =>
    ipcRenderer.invoke('update-paper-status', paperId, status),
  'get-date-entry': (date) => ipcRenderer.invoke('get-date-entry', date),
  'search-papers': (form) => ipcRenderer.invoke('search-papers', form),
  'check-is-new-user': () => ipcRenderer.invoke('check-is-new-user'),
  'update-work-status': (paperId, status) =>
    ipcRenderer.invoke('update-work-status', paperId, status),

  // onboarding
  'add-initial-references': (form) => ipcRenderer.invoke('add-initial-references', form),
  'onboard-new-user': (form) => ipcRenderer.invoke('onboard-new-user', form),
  // shared
  'get-dates-by-year': (year) => ipcRenderer.invoke('get-dates-by-year', year),
  'scrape-date': (date) => ipcRenderer.invoke('scrape-date', date),
});

contextBridge.exposeInMainWorld('socket', {
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  off: (channel, callback) => ipcRenderer.off(channel, callback),
});

// contextBridge.exposeInMainWorld('socket', {
//   onMessage: (callback) => ipcRenderer.on('socket-message', (_event, value) => callback(value)),
// })
