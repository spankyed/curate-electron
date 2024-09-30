import React, { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { FormControl, Box, InputBase } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dateEndAtom, dateStartAtom, submitSearchAtom } from '../store';
import dayjs from 'dayjs';

const DateRangeControl: React.FC<{}> = () => {
  const queryParams = new URLSearchParams(location.search);
  const startDateParam = queryParams.get('startDate');
  const endDateParam = queryParams.get('endDate');
  const [startDate, setStartDate] = useAtom(dateStartAtom);
  const [endDate, setEndDate] = useAtom(dateEndAtom);
  const submitSearch = useSetAtom(submitSearchAtom);

  useEffect(() => {
    if (startDateParam && endDateParam) {
      setStartDate(dayjs(startDateParam));
      setEndDate(dayjs(endDateParam));
      submitSearch({ dateStart: startDateParam, dateEnd: endDateParam });
    }
  }, [startDateParam, endDateParam]);


  return (
    <FormControl
      sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  flexShrink: 0 }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ maxWidth: '12rem' }}
          label={<span style={{ color: '#9e9e9e' }}>After Date</span>}
          value={startDate}
          disableHighlightToday={true}
          disableFuture={true}
          maxDate={endDate ? endDate : null}
          onChange={newValue => setStartDate(newValue)}
        />
        <DatePicker
          label={<span style={{ color: '#9e9e9e' }}>Before Date</span>}
          sx={{ marginLeft: 4, maxWidth: '12rem' }}
          value={endDate}
          disableFuture={true}
          minDate={startDate ? startDate : null}
          onChange={newValue => setEndDate(newValue)}
        />
      </LocalizationProvider>
    </FormControl>
  );
}

export default DateRangeControl;
