import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, FormLabel, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { approvedStateAtom, generatedStateAtom, initialStateAtom, publishedStateAtom } from '../store';

const StateControl: React.FC<{}> = () => {
  const [initialState, setInitialState] = useAtom(initialStateAtom);
  const [approvedState, setApprovedState] = useAtom(approvedStateAtom);
  const [generatedState, setGeneratedState] = useAtom(generatedStateAtom);
  const [publishState, setPublishedState] = useAtom(publishedStateAtom);

  return (
    <FormControl sx={{}} component="fieldset" variant="standard">
      <FormLabel component="legend" sx={{color:'#9e9e9e !important'}}>State</FormLabel>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={6}>
          <FormControlLabel
            control={
            <Checkbox
              checked={initialState}
              onChange={(e) => setInitialState(e.target.checked)}
              name={`states.initial`} />
            }
            label={'Initial'}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
            <Checkbox
              checked={approvedState}
              onChange={(e) => setApprovedState(e.target.checked)}
              name={`states.approved`} />
            }
            label={'Approved'}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
            <Checkbox
              checked={generatedState}
              onChange={(e) => setGeneratedState(e.target.checked)}
              name={`states.generated`} />
            }
            label={'Generated'}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
            <Checkbox
              checked={publishState}
              onChange={(e) => setPublishedState(e.target.checked)}
              name={`states.published`} />
            }
            label={'Published'}
          />
        </Grid>
      </Grid>

    </FormControl>
  );
}

export default StateControl;
