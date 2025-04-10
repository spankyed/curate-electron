import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { RefObject } from 'react';
import * as api from '@renderer/core/api/fetch';
import { modelAtom, keyModalOpen } from '../store';
import { addAlertAtom } from '@renderer/core/components/common/notification/store';

export const inputRefAtom = atom<RefObject<HTMLInputElement> | null>(null);
export const promptPresetsOpenAtom = atom(false);
export const tokenUsageAtom = atom({ document: 0, total: 0, max: 128 });

export const inputAtom = atom('');

export const inputEnabledAtom = atom(true);

export const messagesAtom = atom<any[]>([
  // { id: 2, text: "Can you help me with my project?", timestamp: "2023-05-10T09:01:00Z", role: 'user' },
  // { id: 3, text: "Of course! What do you need help with?", timestamp: "2023-05-10T09:02:00Z", role: 'assistant' }
]);

export const promptOptionsAtom = atomWithStorage<any[]>('promptPresets', [
  {
    id: 1,
    text: 'Write me a very clear explanation of the core assertions, implications, and mechanics elucidated in this paper.',
  },
  {
    id: 2,
    text: 'Write an analogy or metaphor that will help explain this paper to a broad audience.',
  },
  {
    id: 3,
    text: "Explain the value of this in basic terms like you're talking to a CEO. So what? What's the bottom line here?",
  },
]);

export const sendMessageAtom = atom(
  null,
  async (
    get,
    set,
    { paperId, threadId, text }: { paperId: string; threadId: string; text: string }
  ) => {
    set(inputAtom, '');
    set(inputEnabledAtom, false);
    const model = get(modelAtom);

    const newMessage = {
      threadId,
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      role: 'user',
    };

    set(messagesAtom, (prev) => [...prev, newMessage]);

    try {
      const response = await api.sendMessage({ paperId, threadId, text, model });

      // Handle API errors
      if (typeof response === 'object' && response.error) {
        set(inputEnabledAtom, true);
        if (response.code === 403) {
          set(addAlertAtom, {
            message: `${response.error}. Please add your API key in settings.`,
            type: 'error',
            autoClose: false,
          });
          set(keyModalOpen, true); // Open the API key modal
        } else {
          set(addAlertAtom, {
            message: response.error,
            type: 'error',
            autoClose: true,
          });
        }
        return;
      }

      set(messagesAtom, (prev) =>
        prev.map((m) => (m.id === newMessage.id ? { ...m, id: response } : m))
      );

      const responseId = await api.streamResponse({ paperId, threadId, model });

      // Handle stream response errors
      if (typeof responseId === 'object' && responseId.error) {
        set(inputEnabledAtom, true);
        set(addAlertAtom, {
          message: responseId.error,
          type: 'error',
          autoClose: true,
        });
        return;
      }

      const responsePlaceholder = {
        threadId,
        id: responseId,
        text: '...',
        role: 'assistant',
        status: 0,
      };

      set(messagesAtom, (prev) => [...prev, responsePlaceholder]);
    } catch (error) {
      console.error('Failed to send message', error);
      set(inputEnabledAtom, true);
      set(addAlertAtom, {
        message: 'Failed to send message. Please try again.',
        type: 'error',
        autoClose: true,
      });
    }
  }
);

export const handleStreamStatusAtom = atom(
  null,
  async (get, set, { key: responseMessageId, status: newStatus, data: text, final }) => {
    if (!responseMessageId) {
      console.error('Message id not provided', responseMessageId);
      return;
    }

    const errored = (message) => message.status === 2;

    set(messagesAtom, (prev) =>
      prev.map((m) =>
        m.id === responseMessageId
          ? {
              ...m,
              text,
              status: errored(m) ? 2 : final ? 1 : 0,
            }
          : m
      )
    );

    if (final) {
      set(inputEnabledAtom, true);
    }
  }
);
