import React, { useContext } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useAtom } from 'jotai';
import Scraping from './scraping';
import Ranking from './ranking';
import ActionButton from './action-button';
import ErrorState from './error';

function ScrapeStatus({
  date,
  scrapeAtom,
  status,
}: {
  date: string;
  scrapeAtom: any;
  status: string;
}): React.ReactElement {
  function getContent(status) {
    switch (status) {
      case 'pending':
        return <ActionButton date={date} scrapeAtom={scrapeAtom} />;
      case 'scraping':
        return <Scraping />;
      case 'ranking':
        return <Ranking />;
      case 'error':
        return <ErrorState />;
      default:
        return <ErrorState />;
    }
  }

  return <>{getContent(status)}</>;
}

export default ScrapeStatus;
