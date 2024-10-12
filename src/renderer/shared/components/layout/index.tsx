import React, { useCallback, useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  InputBase,
  TextField,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import Sidebar from './sidebar';
import SidebarToggleButton from './sidebar/toggle';
import { colors } from '@renderer/shared/styles/theme';
import MenuIcon from '@mui/icons-material/Menu';
import { sidebarOpenAtom } from './sidebar/store';
import { NotificationManager } from '../notification';
import * as api from '@renderer/shared/api/fetch';
import { isNewUserAtom } from './store';

// const height = 'calc(100vh - 65px)';

function Layout(): React.ReactElement {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useAtom(isNewUserAtom);

  const checkIsNewUser = useCallback(async () => {
    const newUserCheck = await api.checkIsNewUser();

    if (newUserCheck) {
      setIsNewUser(true);
      navigate('/onboard');
    }
  }, []);

  useEffect(() => {
    checkIsNewUser().catch(console.error);
  }, [checkIsNewUser]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          // maxHeight: height,
          height: '100vh',
          maxHeight: '100vh',
          transition: 'all 0.5s ease-in-out',
          backgroundColor: colors.palette.background.default,
          // backgroundColor: colors.palette.background.paper,
          // backgroundColor: '#000',
        }}
      >
        <TitleArea isNewUser={isNewUser} />

        {!isNewUser && <Sidebar />}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <AppBar
            position="sticky"
            sx={{
              backgroundColor: colors.palette.background.default,
              // backgroundColor: 'rgb(76 61 168)',
              // backgroundColor: colors.palette.mom.main,
              // backgroundColor: colors.palette.background.paper,
              // borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: 'none',
              // backgroundImage: 'none',
            }}
            style={
              {
                WebkitAppRegion: 'drag',
                // biome-ignore lint/suspicious/noExplicitAny: Apply webkitAppRegion here to drag window
              } as any
            }
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!isNewUser && <SearchInput />}
            </Toolbar>
          </AppBar>
          {!isNewUser && <SidebarToggleButton />}
          <Outlet />
        </Box>
      </Box>

      <NotificationManager />
    </>
  );
}

function TitleArea({ isNewUser }) {
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom); // Assuming you have a setter function for the sidebar open state

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };

  return (
    <div
      style={{
        display: 'flex',
        marginLeft: '.4rem',
        width: '230px',
        position: 'absolute',
        top: '.9rem',
        left: '1.4rem',
        zIndex: 9999,
        WebkitAppRegion: 'drag',
      }}
    >
      {/* {
        !isNewUser && (
          <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        )
      } */}

      <Link
        color="inherit"
        to={isNewUser ? '/onboard' : '/calendar'}
        style={{ WebkitAppRegion: 'no-drag' }} // Exclude the Link from being draggable
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              borderRadius: '10%',
              padding: '1px 7px',
              // border: '2px solid white',
              // backgroundColor: '#4a39ab7a',
              // backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backgroundColor: '#3b278e',
              alignContent: 'center',
              marginLeft: '4rem',
              pointerEvents: 'initial',
              // backgroundColor: colors.palette.primary.light,
            }}
          >
            Curate
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ padding: '4px 4px' }}>
            GPT
          </Typography>
        </div>
      </Link>
    </div>
  );
}

function SearchInput() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const queryParams = new URLSearchParams({ query: searchValue });
    const searchParamsString = queryParams.toString();
    const newUrl = `/search?${searchParamsString}`;

    navigate(newUrl);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', WebkitAppRegion: 'no-drag' }}>
      {' '}
      {/* Form submission */}
      <TextField
        id="query-input"
        label="Keyword"
        value={searchValue}
        size="small"
        onChange={handleSearchInputChange}
        InputLabelProps={{ style: { color: '#9e9e9e' } }}
        sx={{
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
        InputProps={{
          sx: {
            borderTopRightRadius: '0',
            borderBottomRightRadius: '0',
          },
        }}
        fullWidth
      />
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        sx={{
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
          boxShadow: 'none',
        }}
      >
        Search
      </Button>
    </form>
  );
}

export default Layout;
