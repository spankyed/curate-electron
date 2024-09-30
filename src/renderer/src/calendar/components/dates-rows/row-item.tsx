import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Pagination, Typography } from '@mui/material';
import { DateRow } from '@renderer/shared/utils/types';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { formatDate } from '@renderer/shared/utils/dateFormatter';
import List from './papers-carousel';
import { useNavigate } from 'react-router-dom';
import { selectedDateAtom } from '@renderer/shared/store';
import { scrapePapersAtom } from '@renderer/calendar/store';
import ScrapeStatus from '@renderer/shared/components/date/status';
import { colors } from '@renderer/shared/styles/theme';

function RowItem({ dateAtom, isFocalElement }: { dateAtom: PrimitiveAtom<DateRow>; isFocalElement: boolean }): React.ReactElement {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const { date, papers } = useAtomValue(dateAtom); // Access the state of each individual date atom
  const { value, status } = date;
  // const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const navigate = useNavigate();

  const reformatDateMemo = useCallback((inputDate: string): string => {
    return formatDate(inputDate, {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });
  }, []);

  const onDateClick = date => e => {
    const is = tag => e.target.tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('LI');

    if (ignore) return;

    navigate(`/date/${date.value}`);
  }

  const transparentBg = status === 'complete';

  return (
    <Box 
      // onMouseEnter={() => setSelectedDate(value)}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        // borderBottom: '4px solid rgba(0, 0, 0, 0.2)',
        paddingTop: 2,  
        paddingBottom: 2,
        alignSelf: 'center',
        width: '65%',
        // backgroundColor: selectedDate === value ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        // backgroundColor: colors.palette.background.paper,
        backgroundColor: !transparentBg ? colors.palette.background.paper : 'transparent',
        margin: '0rem 2rem',
        marginBottom: '.2rem',
      }}
    >

      <Typography
        onClick={onDateClick(date)}
        className="date-row-title"
        variant="h5" 
        sx={{
          '&:hover': {
            backgroundColor: colors.palette.secondary.main,
          },
          textDecoration: 'none', 
          marginBottom: '4px',
          marginTop: '.5em',
          // background: '#FE6B8B', // Adjust the gradient colors as needed
          backgroundColor: !transparentBg ? colors.palette.background.default : colors.palette.background.paper,
          webkitBackgroundClip: 'text',
          webkitTextFillColor: 'transparent',
          padding: '.25em 1em .25em 1em',
          borderRadius: '5px',
          fontWeight: 'bold',
          // transform: 'skewX(-5deg)', // Adds a slant to the text
          display: 'inline-block', // Necessary for transform
          // border: `2px solid white`,
          // boxShadow: `2px 2px 5px rgba(0, 0, 0, 0.4)`, // Soft shadow with a color that matches the gradient
          // boxShadow: '2px 2px 5px rgb(76 61 168)', // Soft shadow with a color that matches the gradient
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          letterSpacing: '0.01em',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', // subtle text shadow for depth
          cursor: 'pointer',
        }}
      >
        {reformatDateMemo(value)}
      </Typography>

      {
        status === 'complete'
        ? <List papers={papers} date={value} />
        : <ScrapeStatus status={status} date={value} scrapeAtom={scrapePapersAtom}/>
      }
    </Box>
  );
}

export default RowItem;
