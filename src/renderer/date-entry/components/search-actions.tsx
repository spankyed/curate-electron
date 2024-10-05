import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Button, Grid, TextField } from '@mui/material';
import { searchKeywordAtom } from '../store';
import { useAtom } from 'jotai';
// import { Paper, StoreType } from '@renderer/shared/store';
// import SearchIcon from '@mui/icons-material/Search';

const SearchAndActions: React.FC<{ showingTable: boolean }> = ({ showingTable }) => {
  const [, setSearchKeyword] = useAtom(searchKeywordAtom);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection="row" gap={2} 
      style={{ 
        marginTop: '2em', 
        marginBottom: '1em', 
        marginRight: showingTable ? '2em' : '6em',
        width: '80%'
      }}
    >
      <Box sx={{ width: '100%' }}>
        <TextField
          color="secondary"
          label="Search"
          variant="outlined"
          fullWidth
          onChange={handleSearchChange}
        />
      </Box>
    </Box>
  );
}

export default SearchAndActions;
