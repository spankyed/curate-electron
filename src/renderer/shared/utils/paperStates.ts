import { PaperState } from '@renderer/shared/utils/types';

export const paperStates = {
  [PaperState.initial]: {
    label: 'initial',
    color: 'primary',
    // color: undefined,
  },
  [PaperState.approved]: {
    label: 'approved',
    color: 'success',
  },
  [PaperState.generated]: {
    label: 'generated',
    color: 'warning',
  },
  [PaperState.published]: {
    label: 'published',
    color: 'secondary',
  },
}
