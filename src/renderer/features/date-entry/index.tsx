import type React from 'react';
import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useParams } from 'react-router-dom';
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
import PageLayout from '@renderer/core/components/layout/page-layout';
import ResetState from '@renderer/core/components/common/date/reset';
import ScrapeStatus from '@renderer/core/components/common/date/status';
import SocketListener from '@renderer/core/hooks/socket-listener';
import { addAlertAtom } from '@renderer/core/components/common/notification/store';
import type { DateStatus, Paper } from '@renderer/core/config/types';

import dayjs from 'dayjs';
import { updateSidebarDataAtom } from '@renderer/core/components/layout/sidebar/dates/store';

interface DateStatusUpdate {
  key: string;
  status: DateStatus;
  data: Paper[];
}

function DateEntryPage(): React.ReactElement {
  let { dateId } = useParams<{ dateId: string }>();
  dateId = dateId || '';

  const [, fetchData] = useAtom(fetchPapersByDateAtom);
  const [papers] = useAtom(dateEntryPapersAtom);
  const setPageState = useSetAtom(dateEntryStateAtom);

  useEffect(() => {
    fetchData(dateId);
    return () => {
      setPageState('loading');
    };
  }, [dateId, fetchData, setPageState]);

  return (
    <PageLayout padding={3} style={{ marginTop: 3, margin: '0 auto' }}>
      <PageTitle value={dateId} count={papers.length} />
      <RenderByState dateId={dateId} />
    </PageLayout>
  );
}

function RenderByState({ dateId }: { dateId: string }): React.ReactElement {
  const [scrapeStatus, setScrapeStatus] = useAtom(scrapingStateAtom);
  const [state, setPageState] = useAtom(dateEntryStateAtom);
  const setPapers = useSetAtom(dateEntryPapersAtom);
  const addAlert = useSetAtom(addAlertAtom);
  const updateSidebarData = useSetAtom(updateSidebarDataAtom);

  const handleDateStatusUpdate = ({ key, status: newStatus, data: papers }: DateStatusUpdate) => {
    if (newStatus === 'complete') {
      setPapers(papers);
      if (papers.length === 0) {
        setPageState('error');
      } else {
        setPageState('complete');
      }
      setScrapeStatus('pending'); // Reset the scrape status
    } else {
      setPageState(newStatus);
      setScrapeStatus(newStatus);
    }

    if (newStatus === 'error') {
      const id = dayjs(key).format('MM/DD/YYYY');
      addAlert({ message: `There was a problem scraping papers for ${id}`, id });
    }

    updateSidebarData({ key, status: newStatus, count: papers?.length });
  };

  switch (state) {
    case 'complete':
      return <MainTabs papersAtom={filteredPapersAtom} slideUp={true} />;
    case 'loading':
      return <MainTabs isLoading={true} slideUp={true} />;
    case 'error':
      return (
        <div>
          <ResetState date={dateId} resetStatusAtom={resetDateEntryStatusAtom} />
        </div>
      );
    // case 'pending':
    // case 'scraping':
    // case 'ranking':
    default:
      return (
        <>
          <ScrapeStatus
            status={scrapeStatus}
            date={dateId}
            scrapeAtom={scrapePapersDateEntryAtom}
          />
          <SocketListener
            eventName="date_status"
            handleEvent={handleDateStatusUpdate}
            page="date-entry"
          />
        </>
      );
  }
}

export default DateEntryPage;
