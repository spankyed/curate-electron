import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Typography, Box, Tabs, Tab, ToggleButtonGroup, ToggleButton } from '@mui/material';
import PageLayout from '@renderer/shared/components/layout/page-layout';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { fetchPaperAtom, pageStateAtom, paperAtom, scrollableContainerRefAtom } from './store';
import PdfModal from './pdf/modal';
import { useParams } from 'react-router-dom';
import DateAuthorsPdf from './header/date-authors-pdf';
import PaperTitle from './header/title';
import './paper-entry.css';
import { updatePaperAtom } from '@renderer/shared/store';
import ContentTab from './content';
import ChatTab from './chat';
import SocketListener from '@renderer/shared/api/socket-listener';
import { handleStreamStatusAtom } from './chat/messages/store';

const orEmpty = (value: string | undefined) => value || '';

const PaperEntryPage = () => {
  let { paperId } = useParams<{ paperId: string }>();
  paperId = orEmpty(paperId);

  const [, setScrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  const [, fetchData] = useAtom(fetchPaperAtom);
  const [paper] = useAtom(paperAtom);
  const [pageState, setPageState] = useAtom(pageStateAtom);
  const updatePaper = useSetAtom(updatePaperAtom);
  const handleStreamStatus = useSetAtom(handleStreamStatusAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollableContainerRef(containerRef);
  }, [setScrollableContainerRef]);

  useEffect(() => {
    const handlePaperUpdate = (event) => {
      const { id, changes } = event.detail;
      const { field, value } = changes;

      updatePaper({ paperAtom, id, field, newValue: value });
    };

    window.addEventListener('paperUpdate', handlePaperUpdate);

    return () => {
      setPageState('loading');
      window.removeEventListener('paperUpdate', handlePaperUpdate);
    };
  }, []);

  useEffect(() => {
    fetchData(paperId);
  }, [fetchData]);

  return (
    <PageLayout ref={containerRef} padding={3}>
      {pageState === 'error' ? (
        <PaperTitle title={`Error Loading Paper ${paperId}`} id={null} />
      ) : (
        <>
          <Box display="flex" justifyContent="center" flexDirection="column" marginBottom={1}>
            <DateAuthorsPdf paper={paper} />
            <PaperTitle title={paper?.title} id={paper?.id} />
            <Typography variant="body1" paragraph>
              {orEmpty(paper?.abstract)}
            </Typography>
          </Box>

          <TabSection paperId={paperId} />

          <PdfModal paperId={paper?.id} />
        </>
      )}
      <SocketListener eventName="chat_status" handleEvent={handleStreamStatus} />
    </PageLayout>
  );
};

const TabSection = ({ paperId }) => {
  // const paper = useAtomValue(paperAtom);
  const [tabValue, setTabValue] = useState('chat');

  const handleChange = (event: React.SyntheticEvent, newValue: 'chat' | 'content') => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* <ToggleButtonGroup
        color="secondary"
        value={tabValue}
        exclusive
        onChange={handleChange}
        aria-label="Section"
      >
        <ToggleButton value="chat">Chat</ToggleButton>
        <ToggleButton value="content">Content</ToggleButton>
      </ToggleButtonGroup> */}
      {tabValue === 'chat' && <ChatTab paperId={paperId} />} {/* prompts*/}
      {tabValue === 'content' && <ContentTab />}
      {/* {tabValue === 2 && <div>empty</div>} */}
    </Box>
  );
};

export default PaperEntryPage;
