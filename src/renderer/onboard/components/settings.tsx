import React, { useState } from 'react';
import { Box, Grid, Checkbox, Typography, TextField, FormControl, FormHelperText, IconButton, InputAdornment } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { apiKeyOpenAIAtom, autoScrapeDatesAtom } from '../store';
import { VisibilityOff, Visibility } from '@mui/icons-material';

function UserSettings() {
    const [autoScrapeDates, setAutoScrapeDates] = useAtom(autoScrapeDatesAtom);
    const setApiKeyOpenAI = useSetAtom(apiKeyOpenAIAtom);
    const [showApiKey, setShowApiKey] = useState(false);

    const handleToggleShowApiKey = () => {
      setShowApiKey(!showApiKey);
    };

    return (
      <>
        <Typography 
          style={{ color: '#a1a1a1', marginBottom: '2rem'}}
          variant="h3">
          User Settings
        </Typography>

        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ maxWidth: 620, m: 'auto' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Checkbox
                    sx={{ color: '#9e9e9e !important' }}
                    checked={autoScrapeDates}
                    onChange={(event) => setAutoScrapeDates(event.target.checked)}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">Automatically scrape new dates</Typography>
                  <Typography variant="body2" color="textSecondary">
                    At noon each day, attempt to scrape and rank papers for that day. If no papers are found, retry every 3 hours until found. New dates will not appear in the calender until papers have been successfully scraped for that day.
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ mt: 4 }}>
                  <Typography>
                    OpenAI API Key
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{ mt: 6 }}>
                  <TextField
                    type={showApiKey ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    helperText="This key will not leave your computer and can be changed in the chat settings"
                    onChange={(e) => setApiKeyOpenAI(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleShowApiKey}
                            edge="end"
                          >
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
