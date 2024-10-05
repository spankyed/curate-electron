import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ChatOptions from './options';
import DocumentSection from './document';
import MessageList from './messages';
import { useAtom, useSetAtom } from 'jotai';
import { chatStateAtom, loadChatDataAtom } from './store';


export default function ChatTab({ paperId }) {
  const loadChatData = useSetAtom(loadChatDataAtom);
  const setChatState = useSetAtom(chatStateAtom);

  useEffect(() => {
    return () => {
      setChatState('loading');
    }
  }, []); 

  useEffect(() => {
    loadChatData(paperId);
  }, [paperId]); 

  return (
    <Box sx={{ marginTop: 2, mb: 1 }}>
      <ChatOptions />
      {/* <DocumentSection /> */}
      <MessageList />
    </Box>
  );
}
