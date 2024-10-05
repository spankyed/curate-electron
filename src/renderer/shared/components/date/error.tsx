import React, { useContext } from 'react';
import { useAtom } from 'jotai';
import { Typography } from '@mui/material';

const ErrorState = () => {
  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto my-8">
      <Typography variant="h3" sx={{ opacity: 0.3, color: 'red' }}>Error Occurred</Typography>
    </div>
  );
};

export default ErrorState;
