import { atom } from 'jotai';
// import * as api from '@renderer/core/api/fetch';

export const backfillStateAtom = atom<'ready' | 'loading'>('ready');
export const recommendButtonDisabledAtom = atom(false);
