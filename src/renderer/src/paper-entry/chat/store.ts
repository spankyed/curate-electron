import { atom } from 'jotai';
import * as api from '@renderer/shared/api/fetch';
import { messagesAtom, tokenUsageAtom } from './messages/store';
import { atomWithStorage } from 'jotai/utils';
import { selectedThreadsAtom, threadOptionsAtom } from './threads/store';

export const modelAtom = atom('gpt-4o');

export const chatStateAtom = atom<'loading' | 'ready' | 'error'>('loading');

export const loadChatDataAtom = atom(
  null,
  async (get, set, paperId: string) => {
    try {
      const selectedThreadId = get(selectedThreadsAtom)[paperId]?.id;
      const noSelectedThread = selectedThreadId === undefined || selectedThreadId === null;
      const threadsResponse = await api.getThreads(paperId);
      const threads = threadsResponse.data;
      const thread = !noSelectedThread ? selectedThreadId : threads[0]?.id;
      const messagesResponse = await api.getMessages(thread);
      const messages = messagesResponse.data;
      const noMatchingThread = threads.find(thread => thread.id === selectedThreadId) === undefined;

      set(messagesAtom, messages);
      set(threadOptionsAtom, threads);

      if (noSelectedThread || noMatchingThread) {
        set(selectedThreadsAtom, {
          [paperId]: threads[0] 
        });
      }

      const initializeChatResponse = await api.initializeChat(paperId);
      const pdfTokenCount = initializeChatResponse.data;

      set(tokenUsageAtom, prev => ({ ...prev, document: pdfTokenCount }));

      set(chatStateAtom, 'ready');

      console.log('chat data: ', {messages, threads, thread});
    } catch (error) {
      set(chatStateAtom, 'error');
      console.error(`Failed to load chat data: ${paperId}`, error);
    }
  }
);
