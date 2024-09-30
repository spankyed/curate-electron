import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Tooltip } from '@mui/material';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { LoadingButton } from '@mui/lab';
import { DateItem, batchDatesAtom, batchScrapeAtom, batchStateAtom, buttonsDisabledAtom, getDatesAtom } from './store';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { throttle } from '@renderer/shared/utils/throttle';


const BatchScrapeButton = () => {
  const state = useAtomValue(batchStateAtom);
  const dates = useAtomValue(batchDatesAtom);
  const scrapeBatch = useSetAtom(batchScrapeAtom);
  const throttledScrapeBatch = throttle(scrapeBatch, 1000); // Adjust the delay (in milliseconds) as needed
  const disabled = dates.length === 0 || state === 'loading';

  const navigate = useNavigate();
  const isComplete = state === 'complete';

  const onClick = () => {
    if (isComplete) {
      const startDate = dates[0].value;
      const endDate = dates[dates.length - 1].value;
      const queryParams = new URLSearchParams({ startDate, endDate });
      const searchParamsString = queryParams.toString();
      const newUrl = `/search?${searchParamsString}`;
      navigate(newUrl);
    } else {  
      throttledScrapeBatch();
    }
  }

  const scrapeInfo = `Scrape and rank papers for dates in batch. This could take a few minutes. We recommend having less than 75 starred papers as it may reduce the time spent ranking papers.`
  const viewInfo = `After scraping a date batch take the opportunity to review the papers, starring the ones you find interesting. Occasionally un-star papers you no longer find interesting.`

  return (
  <div style={{ display: 'flex', alignItems: 'center' }}> {/* Ensure button and icon are aligned */}
    <LoadingButton
        variant="contained"
        color={isComplete ? 'success' : 'primary'}
        disabled={disabled}
        onClick={onClick}
        loading={state === 'loading'}
        size="small"
        sx={{ marginLeft: 4 }}
      >
      <Tooltip title={isComplete ? viewInfo : scrapeInfo}>
        <HelpOutlineIcon sx={{ mr: 1}}/>
      </Tooltip>
      { isComplete ? 'View Batch' : 'Scrape batch'  }
    </LoadingButton>

  </div>
  );
};

export default BatchScrapeButton;