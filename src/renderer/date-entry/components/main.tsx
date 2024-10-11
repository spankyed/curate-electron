import React, { useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Badge,
  styled,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ThumbPapersGrid from './grid';
import SearchAndActions from './search-actions';
import PapersTable from './table';
import { Paper } from '@renderer/shared/utils/types';
import { dateEntryPapersAtom, tabValueAtom } from '../store';
import { Atom, atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { emptyListAtom, updatePaperInListAtom } from '@renderer/shared/store';
import TocIcon from '@mui/icons-material/Toc';
import AppsIcon from '@mui/icons-material/Apps';
import { colors } from '@renderer/shared/styles/theme';

const MainTabs: React.FC<{
  papersAtom?: Atom<Paper[]>;
  isLoading?: boolean;
  slideUp?: boolean;
}> = ({ papersAtom, isLoading = false, slideUp = false }) => {
  const [tabValue, setTabValue] = useAtom(tabValueAtom);
  const updatePaper = useSetAtom(updatePaperInListAtom);
  const papers = useAtomValue(papersAtom || emptyListAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: 'table' | 'grid') => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const handlePaperUpdate = (event) => {
      const { id, changes } = event.detail;
      const { field, value } = changes;

      updatePaper({ papersListAtom: dateEntryPapersAtom, id, field, newValue: value });
    };

    window.addEventListener('paperUpdate', handlePaperUpdate);

    return () => {
      window.removeEventListener('paperUpdate', handlePaperUpdate);
    };
  }, []);

  const style = {};

  return (
    <Box sx={style}>
      <div className="flex justify-between align-middle items-center">
        <SearchAndActions showingTable={tabValue === 'table'} />
        <ToggleButtonGroup
          color="secondary"
          value={tabValue}
          exclusive
          onChange={handleChange}
          aria-label="Data view"
        >
          <ToggleButton value="table">
            <TocIcon />
          </ToggleButton>
          <ToggleButton value="grid">
            <AppsIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {tabValue === 'table' && <PapersTable papers={papers} isLoading={isLoading} />}
      {tabValue === 'grid' && <ThumbPapersGrid papers={papers} isLoading={isLoading} />}
    </Box>
  );
};

export default MainTabs;
