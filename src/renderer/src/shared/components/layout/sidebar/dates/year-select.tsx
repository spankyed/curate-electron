import React, { useEffect, useState } from 'react';
import { atom, useAtom, useSetAtom } from 'jotai';
import { FormControl, Box, InputBase, MenuItem, Select } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { currentYearAtom, fetchDatesSidebarDataAtom } from './store';

const yearsList = createYearList(1991);

const YearSelect = () => {
  const [selectedYear, setSelectedYear] = useAtom(currentYearAtom);
  const fetchSidebarData = useSetAtom(fetchDatesSidebarDataAtom);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchSidebarData();
  };
  
  return (
    <Select
      sx={{
        px: '1.5rem',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
        width: '100%',
        borderRadius: '0',
      }}
      size='medium'
      labelId="search-field-label"
      id="search-field-select"
      value={selectedYear}
      onChange={(e) => handleYearChange(e.target.value)}
      label=""
      startAdornment={<CalendarMonthIcon />}
    >
      {
        yearsList.map((year) => (
          <MenuItem
            key={year}
            value={year}
            sx={{
              borderTop: '1px solid #e0e0e025',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {year}
          </MenuItem>
        ))
      }
    </Select>
  );
}

function createYearList(startYear: number): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];

  for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
  }

  return years;
}


export default YearSelect;
