import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import Sidebar from './sidebar';
import SidebarToggleButton from './sidebar/toggle';
import { colors } from '@renderer/core/styles/theme';
// import MenuIcon from '@mui/icons-material/Menu';
import { sidebarOpenAtom } from './sidebar/store';
import { NotificationManager } from '../common/notification';
import * as api from '@renderer/core/api/fetch';
import { isNewUserAtom } from './store';
import logo from '@renderer/core/assets/logo.svg';

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
          // transition: 'all 0.5s ease-in-out',
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
  const location = useLocation();
  const onHomePage = () => location.pathname.includes('calendar');

  const [, setSidebarOpen] = useAtom(sidebarOpenAtom);

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };

  return (
    <>
      {/* Clickable overlay */}
      <div
        style={
          {
            position: 'absolute',
            top: '.9rem',
            left: '15rem',
            width: 'calc(100% - 35rem)',
            height: '4rem',
            zIndex: 9998,
            WebkitAppRegion: 'drag',
          } as any
        }
      />

      {/* Original title area */}
      <div
        style={{
          display: 'flex',
          marginLeft: '.4rem',
          width: '230px',
          position: 'absolute',
          top: '.9rem',
          left: '1.4rem',
          zIndex: 9999,
        }}
      >
        <Link color="inherit" to={isNewUser ? '/onboard' : '/calendar'}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: '40px', height: '40px', marginLeft: '4rem' }}
            />
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                padding: '4px 4px',
                '&:hover': {
                  color: 'grey',
                },
                color: onHomePage() ? 'grey' : 'inherit',
              }}
              style={
                {
                  letterSpacing: '3px',
                  WebkitTextSecurity: 'square',
                } as any
              }
            >
              Home
            </Typography>
          </div>
        </Link>
      </div>
    </>
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
