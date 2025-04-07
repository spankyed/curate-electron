import React, { useContext } from 'react';
import { Typography } from '@mui/material';

const ErrorState = () => {
  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto my-8">
      <Typography variant="h3" sx={{ opacity: 0.3, color: 'red' }}>
        Papers Unavailable
      </Typography>
    </div>
  );
};

export default ErrorState;
