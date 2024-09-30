import { atom } from 'jotai';
import { RefObject } from 'react';
import * as api from '@renderer/shared/api/fetch';
import { Paper } from '@renderer/shared/utils/types';

export const scrollableContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(null);

export const paperAtom = atom<Paper | undefined>(undefined);

export const pdfModalOpen = atom(false);

export const pageStateAtom = atom<'loading' | 'ready' | 'error'>('loading');

export const fetchPaperAtom = atom(
  null,
  async (get, set, paperId) => {
    if (!paperId) {
      console.error("Paper id not provided", paperId);
      return;
    }
    set(pageStateAtom, 'loading');

    try {
      const response = await api.getPaperById(paperId);
      const paper = response.data;
      console.log('Paper fetched: ', {paper});

      if (!paper) {
        set(pageStateAtom, 'error');

        return;
      }

      set(paperAtom, paper);
      set(pageStateAtom, 'ready');
    } catch (error) {
      console.error(`Failed to fetch paper with id: ${paperId}`, error);
      set(pageStateAtom, 'error');
    }
  }
);
