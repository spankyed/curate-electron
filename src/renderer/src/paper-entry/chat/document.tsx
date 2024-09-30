import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { Box, Select, MenuItem, Typography } from '@mui/material';
import { paperAtom, pdfModalOpen } from '../store';
import { truncateText } from '@renderer/shared/utils/truncateText';

export default function DocumentSection() {
  const setPdfOpen = useSetAtom(pdfModalOpen);
  const [paper] = useAtom(paperAtom);

  return (
    <Box px={2} pb={2} className='bg-slate-100'>
      <div className='flex justify-between'>
        <Typography variant="h6">{paper?.title}</Typography>
        {/* <Select
          sx={{ ml: 2, height: '2rem', mb: 1, px: 2 }}
          name='document-view-mode'
          size="small"
          variant='standard'
          value={doc.viewMode}
          onChange={(e) => setDoc({...doc, viewMode: e.target.value})}
        >
          <MenuItem value="full">Whole document</MenuItem>
          <MenuItem value="summary">Summary only</MenuItem>
        </Select> */}
      </div>

      <p className='inline'>{truncateText(330, paper?.abstract)}...</p>
      {/* read more link */}
      <Typography
        variant="body2" color="textSecondary" sx={{ display: 'inline', ml: 1, cursor: 'pointer' }}
        onClick={() => setPdfOpen(true)}
        >
        Read more
      </Typography>
    </Box>
  );
};
