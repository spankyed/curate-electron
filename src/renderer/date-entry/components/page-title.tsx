import React, { useMemo } from 'react';
import { Typography, Box, Badge, styled, IconButton } from '@mui/material';
import { formatDateParts } from '@renderer/shared/utils/dateFormatter';
import { dateEntryStateAtom } from '../store';
import { useAtom } from 'jotai';
import { colors } from '@renderer/shared/styles/theme';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';


const ScoreBadge = styled(Badge)<{ count: number }>(({ theme, count }) => ({
  '& .MuiBadge-badge': {
    // top: 8,
    top: '50%',
    // left: '0',
    right: '100%',
    // transform: 'translateX(50%)',
    // backgroundColor: 'rgb(32, 123, 145)',
    backgroundColor: colors.palette.primary.main,
    // backgroundColor: colors.palette.background.paper,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    width: '2.5rem',
    padding: '1rem',
    fontWeight: 'bold',
    letterSpacing: '0.2em',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

const PageTitle: React.FC<{ value: string, count: number }> = ({ value, count }) => {
  const [dateEntryState] = useAtom(dateEntryStateAtom);
  const navigate = useNavigate();

  // const [formattedDate, weekday] = useMemo(() => {
  const formattedDate = useMemo(() => {
    const [weekday, month, day, year] = formatDateParts(value, {
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
  
    return `${weekday}, ${month} ${day}, ${year}`;
  }, [value]);

  const handleArrowClick = (direction: 'next' | 'prev') => {
    const date = dayjs(value);
    const newDate = direction === 'next' ? date.add(1, 'day') : date.subtract(1, 'day');
    navigate(`/date/${newDate.format('YYYY-MM-DD')}`);
  }

  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
      <IconButton
        sx={{ mr: 8 }}
        aria-label="next"
        onClick={() => handleArrowClick('prev')}
      >
        <ArrowBackIosNewIcon fontSize='large'/>
      </IconButton>
      <ScoreBadge 
        badgeContent={`${count}`} 
        count={count}
        max={999}
        invisible={count === 0}
      >
        <Typography variant="h4"
          sx={{
            background: colors.palette.background.paper,
            // background: colors.palette.secondary.main,
            // borderBottom: '2px solid #FF8E53',
            // boxShadow: `0 3px 5px 2px ${colors.primary}`,
            padding: '.5em 2em .5em 2em',
            // border: `2px solid white`,
          // fontWeight: 'bold',
            borderRadius: '5px',
            letterSpacing: '0.0075em',
            // marginTop: '20px',
          }}
        >
          {
            dateEntryState === 'error'
            ? `Error loading date ${value}`
            : formattedDate
          }
          
        </Typography>
      </ScoreBadge>
      <IconButton
        sx={{ ml: 8 }}
        aria-label="next"
        onClick={() => handleArrowClick('next')}
      >
        <ArrowForwardIosIcon fontSize='large'/>
      </IconButton>

    </Box>
  );
}

export default PageTitle;
