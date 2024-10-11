import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Typography, InputAdornment } from '@mui/material';
import config from '@config';
import { useAtom, useSetAtom } from 'jotai';
import { canGoNextAtom, inputIdsAtom, recommendButtonDisabledAtom } from '../store';
import { colors } from '@renderer/shared/styles/theme';

function ReferencesInput() {
  const [inputIds, setInputIds] = useAtom(inputIdsAtom);
  const [inputValue, setInputValue] = useState('');
  const [buttonDisabled, setButtonDisabled] = useAtom(recommendButtonDisabledAtom);
  const setCanGoNext = useSetAtom(canGoNextAtom);

  useEffect(() => {
    if (inputIds.length === 0) {
      setCanGoNext(false);

      if (buttonDisabled) {
        setButtonDisabled(false);
      }
    } else {
      setCanGoNext(true);
    }
  }, [inputIds]);

  const handleUseRecommended = () => {
    const newIds = [...new Set([...inputIds, ...config.seedReferencesIds])];
    setInputIds(newIds);
    setButtonDisabled(true);
  };

  const handleBlur = (event, newValue, reason) => {
    setInputValue(newValue);
  };

  const splitAndAddOptions = (options) => {
    const newOptions = options
      .split(/[\s,]+/)
      .map((option) => option.trim())
      .filter((option) => option.length > 0);
    const newIds = [...new Set([...inputIds, ...newOptions])];
    setInputIds(newIds);
  };

  const handleChange = (event, newValue, reason, details) => {
    if ('blur' === reason) {
      splitAndAddOptions(event.target.value);
      setInputValue('');
    }

    if ('createOption' === reason) {
      splitAndAddOptions(details.option);
    }

    if ('removeOption' === reason) {
      const newOptions = inputIds.filter((option) => option !== details.option);
      setInputIds(newOptions);
    }
  };

  return (
    <>
      <Typography style={{ color: '#a1a1a1', marginBottom: '2rem' }} variant="h3">
        Let's get started
      </Typography>
      <Typography>
        In order to rank new papers, a set of reference papers will need to be used as benchmarks.
      </Typography>
      <Typography>
        Please provide the IDs of arXiv papers that should be used as benchmarks for this ranking
        process.
      </Typography>

      <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column' }}>
        <Autocomplete
          ChipProps={{
            sx: { bgcolor: 'rgba(0,0,0,.25)' },
          }}
          multiple
          freeSolo
          sx={{ width: 765 }}
          id="seed-references"
          disableClearable
          options={[]}
          limitTags={35}
          value={inputIds}
          inputValue={inputValue}
          onChange={handleChange}
          onInputChange={handleBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{ style: { color: '#9e9e9e' } }}
              label="Reference IDs"
              variant="outlined"
              // sx={{ display:  justifyContent: 'center'}}
              onBlur={(event) => handleChange(event, params.InputProps, 'blur', {})}
              InputProps={{
                ...params.InputProps,
                sx: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, minHeight: 250 },
                type: 'text',
                // type: 'search',
              }}
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUseRecommended}
          disabled={buttonDisabled}
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          Use recommended
        </Button>
      </div>
    </>
  );
}

export default ReferencesInput;
