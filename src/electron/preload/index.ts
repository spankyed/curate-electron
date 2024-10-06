import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    api: {
      'get-calendar': () => Promise<string>
      'load-more': (cursor) => Promise<void>
      'load-month': (cursor: number) => Promise<void>
      reset: (date: string) => Promise<void>
      'fetch-pdf': (paperId: string) => Promise<void>
      'paper-by-id': (paperId: string) => Promise<void>
      'star-paper': (paperId: string, value: boolean) => Promise<void>
      'update-paper-status': (paperId: string, status: string) => Promise<void>
      'get-date-entry': (date: string) => Promise<void>
      'search-papers': (form: Record<string, string>) => Promise<void>
      'check-is-new-user': () => Promise<void>
      'update-work-status': (paperId: string, status: string) => Promise<void>
      'get-dates-by-year': (year: number) => Promise<void>
      'scrape-date': (date: string) => Promise<void>
      'initialize-chat': (paperId: string) => Promise<void>
      'get-threads': (paperId: string) => Promise<void>
      'get-messages': (threadId: string) => Promise<void>
      'create-thread': (params: Record<string, string>) => Promise<void>
      'branch-thread': (params: Record<string, string>) => Promise<void>
      'toggle-hide-message': (params: Record<string, string>) => Promise<void>
      'delete-message': (messageId: string) => Promise<void>
      'send-message': (params: Record<string, string>) => Promise<void>
      'stream-response': (params: Record<string, string>) => Promise<void>
      'stop-message-stream': (threadId: string) => Promise<void>
      'regenerate-response': (params: Record<string, string>) => Promise<void>
      'load-batch-dates': (dateRange: Record<string, string>) => Promise<void>
      'get-batch-dates': (params: Record<string, string>) => Promise<void>
      'scrape-batch': (dates: Record<string, string>) => Promise<void>
      // onboarding
      'add-initial-references': (form: Record<string, string>) => Promise<void>
      'onboard-new-user': (form: Record<string, string>) => Promise<void>
    }
    socket: {
      on: (channel, callback: () => void) => void
      off: (channel, callback: () => void) => void
    }
  }
}

contextBridge.exposeInMainWorld('api', {
  'get-calendar': () => ipcRenderer.invoke('get-calendar'),
  'load-more': (cursor) => ipcRenderer.invoke('load-more', cursor),
  'load-month': (cursor) => ipcRenderer.invoke('load-month', cursor),
  reset: (date) => ipcRenderer.invoke('reset', date),
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
  'get-dates-by-year': (year) => ipcRenderer.invoke('get-dates-by-year', year),
  'scrape-date': (date) => ipcRenderer.invoke('scrape-date', date),
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
  'load-batch-dates': (dateRange) => ipcRenderer.invoke('load-batch-dates', dateRange),
  'get-batch-dates': (params) => ipcRenderer.invoke('get-batch-dates', params),
  'scrape-batch': (dates) => ipcRenderer.invoke('scrape-batch', dates),
  // onboarding
  'add-initial-references': (form) => ipcRenderer.invoke('add-initial-references', form),
  'onboard-new-user': (form) => ipcRenderer.invoke('onboard-new-user', form)
})

contextBridge.exposeInMainWorld('socket', {
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  off: (channel, callback) => ipcRenderer.off(channel, callback),
})

// contextBridge.exposeInMainWorld('socket', {
//   onMessage: (callback) => ipcRenderer.on('socket-message', (_event, value) => callback(value)),
// })
