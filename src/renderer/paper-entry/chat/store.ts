import { atom } from 'jotai';
import * as api from '@renderer/shared/api/fetch';
import { messagesAtom, tokenUsageAtom } from './messages/store';
import { atomWithStorage } from 'jotai/utils';
import { selectedThreadsAtom, threadOptionsAtom } from './threads/store';

export const modelAtom = atom('gpt-4o');

export const chatStateAtom = atom<'loading' | 'ready' | 'error'>('loading');

export const loadChatDataAtom = atom(null, async (get, set, paperId: string) => {
  try {
    const selectedThreadId = get(selectedThreadsAtom)[paperId]?.id;
    const noSelectedThread = selectedThreadId === undefined || selectedThreadId === null;
    const threads = await api.getThreads(paperId);
    const thread = !noSelectedThread ? selectedThreadId : threads[0]?.id;
    const messages = await api.getMessages(thread);
    const noMatchingThread = threads.find((thread) => thread.id === selectedThreadId) === undefined;

    set(messagesAtom, messages);
    set(threadOptionsAtom, threads);

    if (noSelectedThread || noMatchingThread) {
      set(selectedThreadsAtom, {
        [paperId]: threads[0],
      });
    }

    const pdfTokenCount = await api.initializeChat(paperId);

    set(tokenUsageAtom, (prev) => ({ ...prev, document: pdfTokenCount }));

    set(chatStateAtom, 'ready');

    console.log('chat data: ', { messages, threads, thread });
  } catch (error) {
    set(chatStateAtom, 'error');
    console.error(`Failed to load chat data: ${paperId}`, error);
  }
});
