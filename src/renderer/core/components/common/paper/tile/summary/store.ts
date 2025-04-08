import { atom } from 'jotai';
import type { Paper } from '@renderer/core/config/types';

type HoveredPaper = Paper | null;
type AnchorEl = HTMLElement | null;

export const popoverTargetAtom = atom<HoveredPaper>(null);
export const isSummaryOpenAtom = atom(false);
export const anchorElAtom = atom<AnchorEl>(null);
export const popoverRefAtom = atom<HTMLElement | null>(null);
export const hoverTimeoutAtom = atom<NodeJS.Timeout | null>(null);
