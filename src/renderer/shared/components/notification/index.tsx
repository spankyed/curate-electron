import React from 'react';
import { useAtom } from 'jotai';
import { Snackbar, Alert, colors } from '@mui/material';
import { alertsAtom, snackbarsAtom } from './store'; // Adjust the import path as needed
import Slide, { SlideProps } from '@mui/material/Slide';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const NotificationManager = () => {
  const [alerts, setAlerts] = useAtom(alertsAtom);
  const [snackbars, setSnackbars] = useAtom(snackbarsAtom);

  return (
    <div>
      {alerts.map((alert, index) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={alert.autoClose ? 6000 : null}
          onClose={() => handleAlertClose(alert.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          style={{
            bottom: (index * 60) + 20, // Offset each alert by 60px upwards
            transition: 'bottom 0.3s ease-in-out'
          }} 
          ClickAwayListenerProps={{ onClickAway: () => null }}
          TransitionComponent={SlideTransition}
        >
          <Alert
          onClose={() => handleAlertClose(alert.id)}
          severity={alert.type || 'warning'}
          style={{ backgroundColor: colors.grey[900]}}
          sx={{ width: '100%' }}
          variant='outlined'
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
      {snackbars.map((snack, index) => (
        <Snackbar
          key={snack.id}
          open={true}
          // {...(snack.autoClose && { autoHideDuration: 3000 })}
          autoHideDuration={snack.autoClose ? 3000 : null}
          onClose={() => handleSnackClose(snack.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          style={{
            bottom: ((alerts.length + index) * 60) + 20,
            transition: 'bottom 0.3s ease-in-out'
          }}
          ClickAwayListenerProps={{ onClickAway: () => null }}
          TransitionComponent={SlideTransition}
        >
          <Alert
            onClose={() => handleSnackClose(snack.id)}
            severity="info"
            style={{ backgroundColor: colors.grey[900] }}
            sx={{
              width: '100%',
            }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );

  function handleAlertClose(id) {
    setAlerts((currentAlerts) => currentAlerts.filter(alert => alert.id !== id));
  }

  function handleSnackClose(id) {
    setSnackbars((currentSnackbars) => currentSnackbars.filter(snack => snack.id !== id));
  }
};
