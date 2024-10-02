import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import DateRows from './dates-rows';
import DatesPlaceholder from './placeholder';
import { fetchCalendarModelAtom, calendarStateAtom, calendarLoadMonthAtom } from '@renderer/calendar/store';
import { BackfillComponent } from '../../onboard/components/dates';
import { openMonthAtom, datesRowsAtom } from '@renderer/shared/components/layout/sidebar/dates/store';
import './main.css';
import { useNavigate } from 'react-router-dom';

function CalendarMain(): React.ReactElement {
  const [, fetchData] = useAtom(fetchCalendarModelAtom);
  const [, loadMonth] = useAtom(calendarLoadMonthAtom);
  const [datesRows] = useAtom(datesRowsAtom); // todo useMemo
  const [openMonth] = useAtom(openMonthAtom);
  const [calendarState] = useAtom(calendarStateAtom);
  const navigate = useNavigate();

  const showBackfill = calendarState === 'backfill'; // todo rename onboarding

  useEffect(() => {
    if (showBackfill) {
      navigate('/backfill');
    }
  }, [calendarState]);

  useEffect(() => {
    const firstDateOfMonth = datesRows.find(d => d.month === openMonth)?.dates[0]?.value; // first date of the open month in sidebar

    if (openMonth && firstDateOfMonth) {
      loadMonth(firstDateOfMonth)
    } else {
      fetchData();
    }
  }, [fetchData]);

  return (
    <>
      <MainContent/>
    </>
  );
}

function MainContent(): React.ReactElement {
  const [calendarState] = useAtom(calendarStateAtom);
  const isLoading = calendarState === 'loading';
  const isError = calendarState === 'error';
  const isEmpty = calendarState === 'backfill';

  return (
    <>
      { isLoading
        ? <DatesPlaceholder />
        : (
          isError || isEmpty
            ? <div className=' place-self-center mt-10'>Failed to fetch calendar data</div>
            : <DateRows />
        )
      }
    </>
  );
}

export default CalendarMain;
