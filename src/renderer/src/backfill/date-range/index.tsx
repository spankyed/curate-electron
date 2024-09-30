import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FormControl, Box, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dateEndAtom, dateStartAtom, backfillStateAtom } from './store';
import LoadingButton from '@mui/lab/LoadingButton';
import { loadDatesAtom } from './store';
import dayjs from 'dayjs';

const DateRangeControl: React.FC<{}> = () => {
  const [startDate, setStartDate] = useAtom(dateStartAtom);
  const [endDate, setEndDate] = useAtom(dateEndAtom);
  const state = useAtomValue(backfillStateAtom);
  const loadDates = useSetAtom(loadDatesAtom);
  const isLoading = state === 'loading';

  const handleStartDateChange = (date) => {
    const newDate = date.isAfter(endDate) ? endDate : date;

    loadDates('start', newDate);
  };

  const handleEndDateChange = (date) => {
    const newDate = date.isBefore(startDate) ? startDate : date;

    loadDates('end', newDate);
  };

  return (
      <FormControl
        required
        error={false}
        component="fieldset"
        variant="standard"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <LoadingButton
          variant="contained"
          color="secondary"
          disabled={!startDate || !endDate}
          onClick={handleSubmit}
          loading={state === 'loading'}
          sx={{ marginRight: 4 }}
        >
          Load Dates
        </LoadingButton> */}
        {/* <FormLabel component="legend">By Date</FormLabel> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled={isLoading}
            label={<span style={{ color: '#9e9e9e' }}>Start Date</span>}
            value={startDate}
            disableHighlightToday={true}
            disableFuture={true}
            // minDate={dayjs().add(-730, 'day')}
            maxDate={endDate ? endDate : dayjs().add(-1, 'day')}
            onChange={handleStartDateChange}
          />
          <DatePicker
            disabled={isLoading}
            sx={{ marginLeft: 4 }}
            label={<span style={{ color: '#9e9e9e' }}>End Date</span>}
            value={endDate}
            disableFuture={true}
            minDate={startDate ? startDate : null}
            onChange={handleEndDateChange}
          />
        </LocalizationProvider>

        {/* <BatchScrapeButton disabled={false} dates={[dates]}/> */}

        {/* <FormHelperText>You can display an error</FormHelperText> */}
      </FormControl>
  );
}

export default DateRangeControl;
