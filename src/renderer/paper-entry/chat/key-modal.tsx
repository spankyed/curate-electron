import { useAtom, useAtomValue } from 'jotai';
import { apiKeyOpenAIAtom, keyModalOpen, keyUpdateErrorAtom } from './store';
import ModalWrapper from '@renderer/shared/components/modal';
import { useEffect, useState } from 'react';
import { TextField, IconButton, InputAdornment, Button } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import * as api from '@renderer/shared/api/fetch';

function KeyModal() {
  const [open, setOpen] = useAtom(keyModalOpen);
  const handleClose = () => setOpen(false);
  const [width, setCalculatedWidth] = useState(550); // Default width
  const apiKey = useAtomValue(apiKeyOpenAIAtom);
  const [error, setError] = useAtom(keyUpdateErrorAtom); // Add error state

  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const calculatedWidth = viewportWidth > 1024 ? viewportWidth * 0.45 : 550;
    setCalculatedWidth(calculatedWidth);
  }, []);

  const handleSave = async () => {
    const success = await api.updateAPIKeys({
      openai: apiKey,
    });

    console.log('key update success: ', success);

    if (success) {
      setError(null);

      handleClose();
    } else {
      setError('Invalid API key. Please try a different key.');
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <ModalWrapper open={open} handleClose={handleClose} width={width}>
      {/* Modal content here */}
      {/* <Typography sx={{ textAlign: 'center' }}>API Keys</Typography> */}
      <KeyForm error={error} />
      {/* <button onClick={handleCancel} style={{ marginRight: '10px' }}>
          Cancel
        </button>
        <button onClick={handleSave}>Save</button> */}

      <div className="flex justify-end w-full mt-8">
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="secondary"
          style={{ marginRight: '10px' }}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </div>
    </ModalWrapper>
  );
}

function KeyForm({ error }: { error: string | null }) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKeyOpenAI] = useAtom(apiKeyOpenAIAtom);
  const handleToggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  async function fetchAPIKeys() {
    const key = await api.getAPIKeys();
    setApiKeyOpenAI(key);
  }

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  return (
    <>
      <TextField
        value={apiKey}
        label="OpenAI"
        type={showApiKey ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        error={Boolean(error)} // MUI built-in error handling
        helperText={error || 'Your API key is stored locally, unencrypted.'} // Display error message if there is one
        onChange={(e) => setApiKeyOpenAI(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleToggleShowApiKey} edge="end">
                {showApiKey ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}

export default KeyModal;
