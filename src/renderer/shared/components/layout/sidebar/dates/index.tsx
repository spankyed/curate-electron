import type React from 'react';
import { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { List, ListItemButton, ListItemText, ListSubheader, Collapse } from '@mui/material';
import { Link } from 'react-router-dom';
import { selectedDateAtom } from '@renderer/shared/store'; // Import your Jotai atoms
import { useAtom } from 'jotai';
import { formatDateParts } from '@renderer/shared/utils/dateFormatter';
import {
  datesRowsAtom,
  fetchDatesSidebarDataAtom,
  lastOpenMonthAtom,
  openMonthAtom,
} from './store';
import { styled } from '@mui/system';
import { useLocation } from 'react-router-dom';
import { calendarLoadMonthAtom, calendarStateAtom } from '@renderer/calendar/store';
import { scrollToElement } from '@renderer/shared/utils/scrollPromise';
import getDaysInMonth from '@renderer/shared/utils/getDaysInMonth';
import DoneIcon from '@mui/icons-material/Done';
import { colors } from '@renderer/shared/styles/theme';
import YearSelect from './year-select';

function DateList(): React.ReactElement {
  const [datesRows] = useAtom(datesRowsAtom); // todo useMemo
  console.log('datesRows: ', datesRows);
  const [, fetchSidebarData] = useAtom(fetchDatesSidebarDataAtom);
  const container = useRef(null);

  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  return (
    <>
      <List
        ref={container}
        sx={{
          overflow: 'scroll',
          overflowX: 'hidden',
          // backgroundColor: colors.main,
          flexGrow: 1,
          py: 0,
          // mr: -1.2,
          // display: 'flex',
          // flexDirection: 'column',
          // paddingLeft: '8px',
          // marginLeft: '.2rem', // Add 1rem margin to the left
        }}
        // sx={{
        //   overflow: 'auto',
        //   overflowX: 'hidden',
        //   position: 'relative',
        //   flexGrow: 1,
        //   display: 'flex',
        //   flexDirection: 'column',
        //   py: 0,
        // }}
      >
        {datesRows.map?.(({ month, dates }) => (
          <Month key={month} month={month} dates={dates} container={container} />
        ))}
      </List>
      <div style={{ width: '100%' }}>
        <YearSelect />
      </div>
    </>
  );
}

function Month({ month, dates, container }) {
  const [allComplete, setAllComplete] = useState(false);
  const daysInMonth = useMemo(() => getDaysInMonth(month), [month]);

  useEffect(() => {
    const allComplete = dates.every((date) => date.status === 'complete');

    if (dates.length == daysInMonth && allComplete) {
      setAllComplete(true);
    }
  }, [dates]);

  const [selectedDate] = useAtom(selectedDateAtom);
  const [openMonth, setOpenMonth] = useAtom(openMonthAtom);
  const [lastOpenMonth, setLastOpenMonth] = useAtom(lastOpenMonthAtom);
  const [, loadMonth] = useAtom(calendarLoadMonthAtom);
  const [, setCalendarState] = useAtom(calendarStateAtom);
  const collapseRefs = useRef({}); // Step 1: Create refs object
  const location = useLocation();

  const clickMonth = (month: string) => {
    setOpenMonth(openMonth === month ? '' : month);
  };

  const handleMonthOpen = async (month: string) => {
    const element = collapseRefs.current[month];
    const onCalendarPage = location.pathname.startsWith('/calendar');
    const monthChanged = lastOpenMonth !== month;

    if (onCalendarPage && monthChanged) {
      setCalendarState('loading');
    }

    if (element) {
      // todo load month data first, after adding scrollPromise queue
      await scrollToElement({
        element,
        container,
        options: { behavior: 'smooth', block: 'start' },
        method: 'scrollIntoView',
      });
    }

    if (!monthChanged) {
      return;
    }

    setLastOpenMonth(month);

    if (onCalendarPage) {
      const date = dates[0]?.value;

      loadMonth(date);
    }
  };

  function reformatDate(inputDate: string): string[] {
    return formatDateParts(inputDate, {
      weekday: 'long',
      day: '2-digit',
    });
  }

  return (
    <>
      {/* <MonthItem onClick={() => clickMonth(month)} sx={{ fontWeight: 'bolder' }}> */}
      <MonthItem
        key={month}
        ref={(el) => {
          collapseRefs.current[month] = el;
        }}
        sx={{ fontWeight: 'bolder', flexGrow: 1 }}
        onClick={() => clickMonth(month)}
      >
        <ListItemText
          primary={
            <span
              style={{ fontWeight: '600', color: 'rgba(232, 230, 227, 0.85)' }}
              className="flex justify-center"
            >
              {month}
              {allComplete ? <DoneIcon sx={{ color: colors.palette.success.light }} /> : null}
            </span>
          }
          sx={{
            // borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            paddingBottom: '4px',
            // textAlign: 'center',
            marginLeft: '5%',
            // paddingLeft: '.2rem',
            color: 'rgba(232, 230, 227, 0.1)',
          }}
        />
      </MonthItem>
      <Collapse in={openMonth === month} timeout="auto" onEntered={() => handleMonthOpen(month)}>
        <List component="div">
          {dates.map((date) => {
            // const formattedDate = useMemo(() => reformatDate(date.value), [date.value]);
            const [formattedDate, formattedWeekday] = reformatDate(date.value);
            return (
              <Link to={`/date/${date.value}`} key={`date-${date.value}`}>
                <ListItemButton selected={selectedDate === date.value}>
                  <ListItemText
                    primary={
                      <DateDisplay
                        formattedDate={formattedDate}
                        formattedWeekday={formattedWeekday}
                        count={date.count}
                      />
                    }
                    sx={{
                      paddingLeft: '1.5rem',
                    }}
                  />
                </ListItemButton>
              </Link>
            );
          })}
        </List>
      </Collapse>
    </>
  );
}

const MonthItem = styled(ListItemButton)(({ theme }) => ({
  marginLeft: '.7rem', // Add 1rem margin to the left
  // marginRight: '4rem', // Add 1rem margin to the left
  whiteSpace: 'nowrap',
  borderBottom: '1px solid rgba(140, 130, 115, 0.22)',
}));

const dateStyle = {
  padding: '4px 16px 4px 0px',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  // marginLeft: '-.8rem',
  whiteSpace: 'nowrap',
  color: 'rgba(232, 230, 227, 0.6)',
};

const weekdayStyle = {
  // paddingLeft: '16px',
  paddingLeft: '8px',
  whiteSpace: 'nowrap',
  marginLeft: '1rem',
};

function DateDisplay({
  formattedDate,
  formattedWeekday,
  count,
}: {
  formattedDate: string;
  formattedWeekday: string;
  count: number | undefined;
}): React.ReactElement {
  return (
    <div style={{ position: 'relative' }}>
      {' '}
      {/* Using a div as a parent container for better semantics */}
      <span style={dateStyle}>{formattedDate}</span>
      <span style={weekdayStyle}>{formattedWeekday}</span>
      {count && (
        <span
          style={{
            padding: '.3rem',
            // position: 'absolute',
            // right: '0',
            whiteSpace: 'nowrap',
            opacity: 0.4,
            borderRadius: '30%',
            fontSize: '.8em',
            marginTop: '-.2rem',
            // marginRight: '-.2rem',
            marginLeft: '.2rem',
            // backgroundColor: 'rgba(76, 61, 168, .3)',
            // border: '1px solid rgba(0, 0, 0, 0.3)',
            // backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

export default DateList;
