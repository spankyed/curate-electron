import { sendToMainWindow } from '@main/create-window';
import type { Paper } from '@services/api/search/repository';

type Notification = {
  key: string;
  status: string;
  data?: Paper[];
  final?: boolean;
};

export async function updateWorkStatus(
  { key, status, data, final }: Notification,
  alwaysNotify = true
) {
  if (alwaysNotify || status === 'complete') {
    // console.log('update-work-status: ', { key, status, data: !!data, final });
    sendToMainWindow('date_status', { type: 'dates', key, status, data, final });
  }

  return 'success';
}
