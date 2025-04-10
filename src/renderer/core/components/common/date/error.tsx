import React, { useContext } from 'react';
import { Typography } from '@mui/material';

const ErrorState = () => {
  return (
    <div className="flex flex-col items-center p-4 mx-auto my-8">
      <Typography variant="h4" sx={{ opacity: 0.2, color: 'red' }}>
        Papers Unavailable
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.3, color: 'red' }}>
        Please try again later today or tomorrow.
      </Typography>
    </div>
  );
};

export default ErrorState;
