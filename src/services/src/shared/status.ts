import { WebServerPath } from "./constants";
import createRequest from "./request";

const webService = createRequest(WebServerPath);

type Notification = {
  key: string;
  status: string;
  data?: any;
  final?: boolean;
};

export function notifyClient(notification: Notification, alwaysNotify = true) {
  if (alwaysNotify || notification.status === 'complete') {
    return webService.post(`work-status/dates`, notification);
  }

  return Promise.resolve();
}
