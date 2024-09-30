import React, { useContext } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useAtom } from 'jotai';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import DescriptionIcon from '@mui/icons-material/Description';
import StarHalfIcon from '@mui/icons-material/StarHalf';

function ActionButton({ date, scrapeAtom }: { date: string; scrapeAtom: any }): React.ReactElement {
  const [, scrapePapers] = useAtom(scrapeAtom);

  const scrape = () => {
    scrapePapers(date);
  }
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} margin={3}>
      <Typography variant="h3" sx={{ opacity: 0.5 }}>Not Scraped</Typography>

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          onClick={scrape}
          sx={{ p:1, px: 10, position: 'relative' }}
        >
          <div className='flex opacity-20 absolute justify-between w-full px-7 pointer-events-none'>
            {/* <SavedSearchIcon sx={{ height: 70, width: 70 }} /> */}
            <StarHalfIcon  />
            <DescriptionIcon  />
          </div>
          Scrape

          <span className='opacity-35 p-1'>•</span>
          Rank
        </Button>
        {/* <Button variant="contained" color="secondary" disabled>Generate Content*</Button> */}
        {/* <Button variant="contained" color="primary" disabled>Fully auto</Button> */}
      </Box>
    </Box>
  );
}

export default ActionButton;
