import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Typography, Box } from '@mui/material';
import PageLayout from '@renderer/core/components/layout/page-layout';
import { useAtom, useSetAtom } from 'jotai';
import { fetchPaperAtom, pageStateAtom, paperAtom, scrollableContainerRefAtom } from './store';
import PdfModal from './pdf/modal';
import { useParams } from 'react-router-dom';
import DateAuthorsPdf from './header/date-authors-pdf';
import PaperTitle from './header/title';
import './paper-entry.css';
import { updatePaperAtom } from '@renderer/core/store';
import ContentTab from './content';
import ChatTab from './chat';
import SocketListener from '@renderer/core/hooks/socket-listener';
import { handleStreamStatusAtom } from './chat/messages/store';
import KeyModal from './chat/key-modal';

const orEmpty = (value: string | undefined) => value || '';

const PaperEntryPage: React.FC = () => {
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
    const handlePaperUpdate = (event: CustomEvent) => {
      const { id, changes } = event.detail;
      const { field, value } = changes;

      updatePaper({ paperAtom, id, field, newValue: value });
    };

    window.addEventListener('paperUpdate', handlePaperUpdate as EventListener);

    return () => {
      setPageState('loading');
      window.removeEventListener('paperUpdate', handlePaperUpdate as EventListener);
    };
  }, [updatePaper, setPageState]);

  useEffect(() => {
    fetchData(paperId);
  }, [fetchData, paperId]);

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

          <KeyModal />
          <PdfModal paperId={paper?.id} />
        </>
      )}
      <SocketListener eventName="chat_status" handleEvent={handleStreamStatus} page="paper-entry" />
    </PageLayout>
  );
};

interface TabSectionProps {
  paperId: string;
}

const TabSection: React.FC<TabSectionProps> = ({ paperId }) => {
  const [tabValue] = useState<'chat' | 'content'>('chat');

  return (
    <Box>
      {tabValue === 'chat' && <ChatTab paperId={paperId} />}
      {tabValue === 'content' && <ContentTab />}
    </Box>
  );
};

export default PaperEntryPage;
