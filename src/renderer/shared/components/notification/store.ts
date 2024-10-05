import { atom } from 'jotai';

const createId = () => Math.random().toString(36).substring(2, 9);

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface Alert {
  id?: string;
  message: string;
  type?: AlertType;  // Adapt types as necessary
  autoClose?: boolean;  // Defines if the snackbar/alert should auto-close
}

interface Snackbar {
  id?: string;
  message: string;
  autoClose?: boolean;
}

export const alertsAtom = atom<Alert[]>([]);
export const snackbarsAtom = atom<Snackbar[]>([]);

export const addAlertAtom = atom(
  null,
  (get, set, { id, message, type, autoClose }: Alert) => {
    const alerts = get(alertsAtom);

    if (alerts.some(alert => alert.id === id)) {
      return;
    }

    set(alertsAtom, [...alerts, { id: id || createId(), message, type, autoClose }]);
  }
);

export const addSnackAtom = atom(
  null,
  (get, set, { id, message, autoClose }: Snackbar) => {
    const snackbars = get(snackbarsAtom);

    if (snackbars.some(alert => alert.id === id)) {
      return;
    }

    set(snackbarsAtom, [...snackbars, { id: id || createId(), message, autoClose }]);
  }
);

// export const removeAlertAtom = atom(
//   null,
//   (get, set, id) => {
//     const alerts = get(alertsAtom);
//     set(alertsAtom, alerts.filter(alert => alert.id !== id));
//   }
// );

// export const removeSnackAtom = atom(
//   null,
//   (get, set, id) => {
//     const snackbars = get(snackbarsAtom);
//     set(snackbarsAtom, snackbars.filter(snack => snack.id !== id));
//   }
// );
