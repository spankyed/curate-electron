import { atom } from 'jotai';
import * as api from '@renderer/shared/api/fetch';
import { messagesAtom } from '../messages/store';
import { atomWithStorage } from 'jotai/utils';
import { chatStateAtom } from '../store';

type Thread = {
  id: string;
  paperId: string;
  messageId?: string;
  description: string;
};

type SelectedThreads = { [ key: string ]: Thread };
export const selectedThreadsAtom = atomWithStorage<SelectedThreads>('selectedThread', {});
export const threadOptionsAtom = atom<any[]>([
  // { description: 'Main thread', id: `1` },
]);

export const selectAndLoadMessagesAtom = atom(
  null,
  async (get, set, paperId: string, selectedThread: any) => {
    try {
      set(selectedThreadsAtom, prev => ({ ...prev, [paperId]: selectedThread }));
      set(chatStateAtom, 'loading');
      const response = await api.getMessages(selectedThread.id);
      const messages = response.data;

      set(chatStateAtom, 'ready');

      set(messagesAtom, messages);
    } catch (error) {
      set(chatStateAtom, 'error');
      console.error(`Failed to load chat data: ${paperId}`, error);
    }
  }
);


export const branchThreadAtom = atom(
  null,
  async (get, set, paperId: string, message: any) => {
    const threadOptions = get(threadOptionsAtom);
    const newThread = {
      paperId,
      parentThreadId: message.threadId,
      messageId: message.id,
      description: message.text,
      id: `${threadOptions.length + 1}`,
    };

    set(threadOptionsAtom, prev => ([...prev, newThread]));
    set(selectedThreadsAtom, prev => ({ ...prev, [paperId]: newThread }));
    set(chatStateAtom, 'loading')

    try {
      const response = await api.branchThread(newThread);
      const { messages, thread: newThreadRecord} = response.data;

      set(messagesAtom, messages);

      set(threadOptionsAtom, prev => (prev.map(thread => {
        if (thread.id === newThread.id) {
          return {
            ...thread,
            ...newThreadRecord
          };
        }
        return thread;
      })));

      set(selectedThreadsAtom, prev => ({ ...prev, [paperId]: newThreadRecord }));
  
      set(chatStateAtom, 'ready');

      console.log('branched thread: ', newThreadRecord);
    } catch (error) {
      // set(threadOptionsAtom, prev => {
      //   return prev.filter(thread => thread.id !== newThread.id);
      // })
      // set(selectedThreadsAtom, {});
      console.error(`Failed to create new thread`, error);
    }
  }
);

export const addNewThreadAtom = atom(
  null,
  async (get, set, paperId: string) => {
    const threadOptions = get(threadOptionsAtom);
    const newThread = {
      paperId,
      description: `Thread ${threadOptions.length + 1}`,
      id: `${threadOptions.length + 1}`,
    };

    set(threadOptionsAtom, prev => ([...prev, newThread]));
    set(selectedThreadsAtom, prev => ({ ...prev, [paperId]: newThread }));
    set(messagesAtom, []);
    set(chatStateAtom, 'loading')

    try {
      const response = await api.createThread(newThread);
      const newThreadRecord = response.data;

      set(threadOptionsAtom, prev => (prev.map(thread => {
        if (thread.id === newThread.id) {
          return { ...thread, id: newThreadRecord.id };
        }
        return thread;
      })));

      set(selectedThreadsAtom, prev => ({ ...prev, [paperId]: newThreadRecord }));
  
      set(chatStateAtom, 'ready');

      console.log('new thread: ', newThreadRecord);
    } catch (error) {
      // set(threadOptionsAtom, prev => {
      //   return prev.filter(thread => thread.id !== newThread.id);
      // })
      // set(selectedThreadsAtom, {});
      console.error(`Failed to create new thread`, error);
    }
  }
);
