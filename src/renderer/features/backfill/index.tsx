import type React from 'react';
import { useSetAtom } from 'jotai';
import { Paper } from '@mui/material';

import './backfill.css';
import PageLayout from '@renderer/core/components/layout/page-layout';
import DateRange from './date-range';
import BatchTable from './batch-scrape';
import { updateStatusAtom } from './batch-scrape/store';
import SocketListener from '@renderer/core/hooks/socket-listener';
import { addAlertAtom } from '@renderer/core/components/common/notification/store';
import dayjs from 'dayjs';
import { updateSidebarDataAtom } from '@renderer/core/components/layout/sidebar/dates/store';
import BatchScrapeButton from './batch-scrape/scrape-button';

interface ScrapedPaper {
  id: string;
  title: string;
  abstract?: string;
  // Add other paper properties as needed
}

interface DateStatusUpdate {
  key: string;
  status: 'complete' | 'error' | 'pending' | 'loading' | 'cancelled';
  data: ScrapedPaper[];
}

const BackfillPage: React.FC = () => {
  const updateStatus = useSetAtom(updateStatusAtom);
  const addAlert = useSetAtom(addAlertAtom);
  const updateSidebarData = useSetAtom(updateSidebarDataAtom);

  const handleDateStatusUpdate = ({ key, status: newStatus, data: papers }: DateStatusUpdate) => {
    updateStatus({ key, status: newStatus, count: papers?.length });

    if (key === 'batch' && newStatus === 'complete') {
      addAlert({ type: 'success', message: 'Batch scraping complete!', autoClose: true });
    } else if (key === 'batch' && newStatus === 'cancelled') {
      addAlert({ type: 'warning', message: 'Batch scraping was cancelled', autoClose: true });
    } else if (newStatus === 'error') {
      const id = dayjs(key).format('MM/DD/YYYY');
      addAlert({ id, message: `There was a problem scraping papers for ${id}`, autoClose: true });
    }

    updateSidebarData({ key, status: newStatus, count: papers?.length });
  };

  return (
    <PageLayout padding={3}>
      <Paper
        sx={{ mb: 3, width: 'fit-content', mx: 'auto' }}
        elevation={2}
        className="flex flex-row w-full p-12"
      >
        <DateRange />
        <BatchScrapeButton />
      </Paper>

      <BatchTable />

      {/* <Button variant="contained" color='success' onClick={()=>{}} style={{ width: '20rem', placeSelf: 'center' }}>
        Scrape Recommended
      </Button> */}

      <SocketListener
        eventName="date_status"
        handleEvent={handleDateStatusUpdate}
        id="batch-scrape"
        page="batch"
      />
    </PageLayout>
  );
};

export default BackfillPage;
