import React, { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { FormControl, Box, InputBase } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dateEndAtom, dateStartAtom, submitSearchAtom } from '../store';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

const DateRangeControl: React.FC<{}> = () => {
  const location = useLocation();
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
      sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexShrink: 0 }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={<span style={{ color: '#9e9e9e' }}>From Date</span>}
          value={startDate}
          maxDate={endDate ? endDate : null}
          disableHighlightToday={true}
          disableFuture={true}
          sx={{ maxWidth: '12rem' }}
          onChange={(newValue) => setStartDate(newValue)}
        />
        <DatePicker
          label={<span style={{ color: '#9e9e9e' }}>To Date</span>}
          value={endDate}
          minDate={startDate ? startDate : null}
          disableFuture={true}
          sx={{ marginLeft: 4, maxWidth: '12rem' }}
          onChange={(newValue) => setEndDate(newValue)}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default DateRangeControl;
