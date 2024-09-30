import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Link } from '@mui/material';
import { useAtom } from 'jotai';
import { pdfModalOpen } from '../store';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@renderer/shared/utils/dateFormatter';
import Favorite from '@renderer/shared/components/paper/favorite';
import { Paper } from '@renderer/shared/utils/types';
import { colors } from '@renderer/shared/styles/theme';

const createAuthorSearchURL = (authorName) => {
  const [lastName, firstName] = authorName.split(' ');
  if (!firstName || !lastName) return '#';
  const query = `${lastName},+${firstName.charAt(0)}`;
  return `https://arxiv.org/search/cs?searchtype=author&query=${query}`;
};

const DateAuthorsPdf: React.FC<{ paper: Paper | undefined }> = ({ paper }) => {
  const navigate = useNavigate();
  const [, setOpen] = useAtom(pdfModalOpen);

  const { date, authors } = paper || {};
  const authorsList = authors?.split(';').map(p => p.trim()) || [];

  const handleOpen = () => setOpen(true);

  const onDateClick = date => e => {
    navigate(`/date/${date}`);
  }

  const formattedDate = formatDate(date || '', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
      { date && (
          <Typography
          variant="subtitle1"
          color="textSecondary"
          onClick={onDateClick(date)}
          style={{ cursor: 'pointer', paddingRight: '1rem' }}
          sx={{
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
          >
            {formattedDate}
          </Typography>
        )
      }
      <Box sx={{ maxWidth: '70%' }}>
        {authorsList.map((author, index) => (
          <React.Fragment key={index}>
            <Link href={createAuthorSearchURL(author)} color="secondary.light" underline="hover" target="_blank">
              {author}
            </Link>
            {index < authorsList.length - 1 ? ', ' : ''}
          </React.Fragment>
        ))}
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Favorite paper={paper}/>
        <Button sx={{ ml: 2 }} variant="contained" onClick={handleOpen}>View PDF</Button>
      </Box>
    </Box>
  )
};

export default DateAuthorsPdf;
