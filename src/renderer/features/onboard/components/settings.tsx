import type React from 'react';
import { useState } from 'react';
import {
  Box,
  Grid,
  // Checkbox,
  Typography,
  TextField,
  // FormControl,
  // FormHelperText,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
// import { apiKeyOpenAIAtom, autoScrapeDatesAtom, validKeyErrorAtom } from '../store';
import { apiKeyOpenAIAtom, validKeyErrorAtom } from '../store';
import { VisibilityOff, Visibility } from '@mui/icons-material';

function UserSettings() {
  // const [autoScrapeDates, setAutoScrapeDates] = useAtom(autoScrapeDatesAtom);
  const setApiKeyOpenAI = useSetAtom(apiKeyOpenAIAtom);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useAtom(validKeyErrorAtom); // Add error state

  const handleToggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  //on change if length is 0, set error to ''
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyOpenAI(e.target.value);

    if (e.target.value.length === 0) {
      setError('');
    }
  };

  return (
    <>
      <Typography style={{ color: '#a1a1a1', marginBottom: '2rem' }} variant="h3">
        User Settings
      </Typography>

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ maxWidth: 620, m: 'auto' }}>
          <Grid container spacing={2} alignItems="center">
            {/* <Grid item xs={3} sx={{ textAlign: 'center' }}>
              <Checkbox
                disabled={true}
                sx={{ color: '#9e9e9e !important', justifyContent: 'center' }}
                checked={autoScrapeDates}
                onChange={(event) => setAutoScrapeDates(event.target.checked)}
              />
              <Typography variant="body2" color="textSecondary">
                (feature unavailable)
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">Automatically scrape new dates</Typography>
              <Typography variant="body2" color="textSecondary">
                Scrape and rank papers at noon each day. Retry every 3 hours if no papers are found.
                New dates will not appear in the calender until papers have been successfully
                scraped for the day.
              </Typography>
            </Grid> */}
            <Grid item xs={3} sx={{ mt: 4 }}>
              <Typography>OpenAI API Key</Typography>
            </Grid>
            <Grid item xs={9} sx={{ mt: 6 }}>
              <TextField
                onChange={handleApiKeyChange}
                error={Boolean(error)} // MUI built-in error handling
                helperText={
                  error || "Your API key won't leave your computer and can be changed at any time"
                }
                type={showApiKey ? 'text' : 'password'}
                variant="outlined"
                fullWidth
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
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
}

export default UserSettings;
