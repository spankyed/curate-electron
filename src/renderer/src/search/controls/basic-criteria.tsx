import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Select, MenuItem, FormControl, TextField, Checkbox, FormControlLabel, FormGroup, Grid, InputAdornment, Button, Box } from '@mui/material';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { favoriteAtom, viewedAtom, relevancyAtom, comparisonOperatorAtom } from '../store';
import RelevancyCriteria from './relevancy';

const BasicCriteriaControl: React.FC<{}> = () => {
  const [favorite, setFavorite] = useAtom(favoriteAtom);
  // const [viewed, setViewed] = useAtom(viewedAtom);

  return (
    <>
      <div className='flex justify-center items-center mr-10'>
        <div className='flex justify-center items-center mr-20'>
          <RelevancyCriteria />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              sx={{ color: '#9e9e9e !important' }}
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)} name="favorite" />
          }
          label={
            <span>
              Starred
              <StarOutlinedIcon style={{ marginLeft: '8px', marginTop: '-4px' }} />
            </span>
          }
        />
      </div>
      {/* <FormControlLabel
        control={
          <Checkbox checked={viewed} onChange={(e) => setViewed(e.target.checked)} name="viewed" />
        }
        label={
          <span>
            Viewed <VisibilityIcon color="info" style={{ marginLeft: '15px' }} />
          </span>
        }
      /> */}

    </>
  );
}

export default BasicCriteriaControl;
