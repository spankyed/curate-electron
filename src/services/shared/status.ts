import { sendToMainWindow } from '@main/create-window';

type Notification = {
  key: string;
  status: string;
  data?: any;
  final?: boolean;
};

export async function updateWorkStatus(
  { key, status, data, final }: Notification,
  alwaysNotify = true
) {
  if (alwaysNotify || status === 'complete') {
    console.log('update-work-status: ', { key, status, data: !!data, final });
    sendToMainWindow('date_status', { type: 'dates', key, status, data, final });
  }

  return 'success';
}
