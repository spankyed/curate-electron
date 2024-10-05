import React, { useContext } from 'react';
import { Typography, Box, LinearProgress } from '@mui/material';
// import { StoreContext } from '@renderer/index';
// import { StoreType } from '../store';
import Description from '@mui/icons-material/Description';

// In your component's render method:


const Scraping: React.FC = () => {
  // const store = useContext<StoreType>(StoreContext);
  // const { checkStatus } = store.calendar;
  // todo determine and show current progress
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} marginTop={3} marginBottom={4}>
      <Typography variant="h3">
        Scraping
        <Description fontSize="inherit" sx={{margin: 1, marginBottom: 2}} />
      </Typography>
      <div style={{ width: 500 }}>
        <LinearProgress />
      </div>
    </Box>
  );
}

export default Scraping;
