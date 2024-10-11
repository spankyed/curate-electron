import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
// import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom'; // Import useParams
import {
  dateEntryPapersAtom,
  dateEntryStateAtom,
  fetchPapersByDateAtom,
  filteredPapersAtom,
  resetDateEntryStatusAtom,
  scrapePapersDateEntryAtom,
  scrapingStateAtom,
} from './store';
import PageTitle from './components/page-title';
import MainTabs from './components/main';
import PageLayout from '@renderer/shared/components/layout/page-layout';
import ResetState from '@renderer/shared/components/date/reset';
import ScrapeStatus from '@renderer/shared/components/date/status';
import SocketListener from '@renderer/shared/api/socket-listener';
import { addAlertAtom } from '@renderer/shared/components/notification/store';
import dayjs from 'dayjs';
import { updateSidebarDataAtom } from '@renderer/shared/components/layout/sidebar/dates/store';

function DateEntryPage(): React.ReactElement {
  let { dateId } = useParams<{ dateId: string }>();
  dateId = dateId || '';

  const [, fetchData] = useAtom(fetchPapersByDateAtom);
  const [papers] = useAtom(dateEntryPapersAtom);
  const setPageState = useSetAtom(dateEntryStateAtom);
  const [state] = useAtom(dateEntryStateAtom);

  useEffect(() => {
    fetchData(dateId);
    return () => {
      setPageState('loading');
    };
  }, [dateId]);

  return (
    <PageLayout padding={3} style={{ marginTop: 3, margin: '0 auto' }}>
      <PageTitle value={dateId} count={papers.length} />
      <RenderByState dateId={dateId} state={state} />
    </PageLayout>
  );
}

function RenderByState({ dateId, state }) {
  const [scrapeStatus, setScrapeStatus] = useAtom(scrapingStateAtom);
  const setPageState = useSetAtom(dateEntryStateAtom);
  const setPapers = useSetAtom(dateEntryPapersAtom);
  const addAlert = useSetAtom(addAlertAtom);
  const updateSidebarData = useSetAtom(updateSidebarDataAtom);

  const handleDateStatusUpdate = ({ key, status: newStatus, data: papers }) => {
    if (newStatus === 'complete') {
      setPapers(papers);
      if (papers.length === 0) {
        setPageState('unexpected');
      } else {
        setPageState('complete');
      }
      setScrapeStatus('pending'); // Reset the scrape status
    } else {
      setScrapeStatus(newStatus);
    }

    if (newStatus === 'error') {
      const id = dayjs(key).format('MM/DD/YYYY');
      addAlert({ message: `There was a problem scraping papers for ${id}`, id });
    }

    updateSidebarData({ key, status: newStatus, count: papers?.length });
  };

  switch (state) {
    case 'loading':
      return <MainTabs isLoading={true} slideUp={true} />;
    case 'error':
      return <></>;
    case 'unexpected':
      return (
        <div>
          <ResetState date={dateId} resetStatusAtom={resetDateEntryStatusAtom} />
        </div>
      );
    case 'pending':
      return (
        <>
          <ScrapeStatus
            status={scrapeStatus}
            date={dateId}
            scrapeAtom={scrapePapersDateEntryAtom}
          />
          <SocketListener eventName="date_status" handleEvent={handleDateStatusUpdate} />
        </>
      );
    case 'complete':
    default:
      return <MainTabs papersAtom={filteredPapersAtom} slideUp={true} />;
  }
}

export default DateEntryPage;
