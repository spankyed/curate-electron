import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as api from '@renderer/shared/api/fetch';
import { paperAtom } from '@renderer/paper-entry/store';
import {
  inputAtom,
  promptPresetsOpenAtom,
  sendMessageAtom,
  messagesAtom,
  tokenUsageAtom,
  inputEnabledAtom,
  inputRefAtom,
} from './store';
import { chatStateAtom } from '../store';
import { selectedThreadsAtom } from '../threads/store';

export const ChatInput = () => {
  const [input, setInput] = useAtom(inputAtom);
  const sendMessage = useSetAtom(sendMessageAtom);
  const [isOpen, setIsOpen] = useAtom(promptPresetsOpenAtom);
  const inputEnabled = useAtomValue(inputEnabledAtom);
  const paper = useAtomValue(paperAtom);
  const selectedThreads = useAtomValue(selectedThreadsAtom);
  const chatState = useAtomValue(chatStateAtom);
  const ready = inputEnabled && chatState === 'ready';
  const setInputRef = useSetAtom(inputRefAtom);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputRef(inputRef);
  }, [setInputRef]);

  const handleSend = async () => {
    if (chatState !== 'ready') {
      return;
    }

    if (input.trim()) {
      sendMessage({
        text: input,
        paperId: paper!.id,
        threadId: selectedThreads[paper!.id]?.id,
      });
    }
  };

  const handleKeyPress = (event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action to avoid form submission or newline in textfield
      handleSend();
    }
  };

  const handleMenuToggle = (event) => {
    setIsOpen(!isOpen);
  };

  return (
    <Box display="flex" position="relative" flexDirection={'column'}>
      <TextField
        color="secondary"
        inputRef={inputRef}
        disabled={!ready}
        multiline
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        fullWidth
        placeholder="Type a message"
        InputProps={{
          sx: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
          startAdornment: (
            <IconButton
              // color="secondary"
              sx={{ mr: 1 }}
              disabled={!ready}
              onClick={handleMenuToggle}
              className="menu-toggle-button"
            >
              <MoreVertIcon />
            </IconButton>
          ),
          endAdornment: (
            <>
              <IconButton disabled={!ready} onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </>
          ),
        }}
      />

      <TokenUsage />
    </Box>
  );
};

const TokenUsage = () => {
  const [tokenUsage, setTokenUsage] = useAtom(tokenUsageAtom);
  const messages = useAtomValue(messagesAtom);
  const chatState = useAtomValue(chatStateAtom);
  const overLimit = tokenUsage.total > tokenUsage.max * 0.95;
  const reachingLimit = tokenUsage.total > tokenUsage.max * 0.7;

  useEffect(() => {
    const newTokenUsage = messages
      .filter((message) => !message.hidden)
      .reduce((acc, message) => acc + (message.text ? message.text.length / 4 : 0), 0);

    const totalTokensRounded = Number(((tokenUsage.document + newTokenUsage) / 1000).toFixed(1));

    if (tokenUsage.total === totalTokensRounded) {
      return;
    }

    setTokenUsage((prev) => ({ ...prev, total: totalTokensRounded }));
  }, [tokenUsage, messages]);

  return (
    <Typography
      variant="caption"
      mt={1}
      mb={3}
      pl={1}
      sx={{
        opacity: '.7',
        color: reachingLimit ? 'orange' : overLimit ? 'red' : '',
      }}
    >
      Token estimate {chatState !== 'ready' ? 0 : tokenUsage.total}k / {tokenUsage.max}k
    </Typography>
  );
};
