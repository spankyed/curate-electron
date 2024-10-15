import type React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ChecklistIcon from '@mui/icons-material/Checklist';

import { useAtom } from 'jotai';
import Dates from './dates';
import { sidebarOpenAtom } from './store';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import ListItemButton from '@mui/material/ListItemButton'; // Import ListItemButton
import { colors } from '@renderer/shared/styles/theme';

const NavItem = styled(ListItemButton)(({ theme }) => ({
  marginLeft: '.5rem', // Add 1rem margin to the left
}));

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <Box
      sx={{
        // paddingTop: '1rem', // Add 1rem margin to the left
        width: isSidebarOpen ? 240 : 0,
        minWidth: 0,
        transition: 'width .3s ease',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        // borderRight: '1px solid rgba(0, 0, 0, 0.9)',
        // backgroundColor: colors.sidebar,
        paddingTop: '4rem',
      }}
    >
      <List
        component="nav"
        sx={{
          // paddingBottom: 0,
          // marginTop: '2rem',
          paddingLeft: '.4rem',
          paddingRight: '.8rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: colors.palette.background.default,
          borderBottom: '1px solid rgba(140, 130, 115, 0.22)',
        }}
      >
        {/* <NavItem onClick={() => navigate('calendar')}>
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </NavItem> */}
        <NavItem
          onClick={() => navigate('search')}
          sx={
            {
              // borderBottom: '1px solid rgba(140, 130, 115, 0.22)',
            }
          }
        >
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText sx={{ marginLeft: '1rem' }} primary="Search" />
        </NavItem>

        {/* <NavItem onClick={() => navigate('analytics')}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </NavItem> */}

        <NavItem onClick={() => navigate('backfill')}>
          <ListItemIcon>
            <ChecklistIcon />
          </ListItemIcon>
          <ListItemText sx={{ marginLeft: '1rem' }} primary="Backfill" />
        </NavItem>
      </List>
      <Dates />
    </Box>
  );
};

export default Sidebar;
