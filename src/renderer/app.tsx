// import './assets/main.css'

import type React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'jotai';
import { colors } from './core/styles/theme';
import Layout from './core/components/layout';
import CalendarPage from './features/calendar';
import DateEntryPage from '@renderer/features/date-entry';
import PaperEntryPage from '@renderer/features/paper-entry';
import SearchPage from '@renderer/features/search';
import OnboardPage from '@renderer/features/onboard';
import BackfillPage from '@renderer/features/backfill';
import './core/styles/index.css';
import { ErrorBoundary } from 'react-error-boundary';
import DevErrorBoundary from '@renderer/core/error/dev';

const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={DevErrorBoundary}>
    <Layout />
  </ErrorBoundary>
);

const router = createHashRouter([
  {
    path: '/',
    element: <ErrorBoundaryLayout />,
    children: [
      { index: true, element: <Navigate to="/calendar" /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'onboard', element: <OnboardPage /> },
      { path: 'backfill', element: <BackfillPage /> },
      { path: 'date/:dateId', element: <DateEntryPage /> },
      { path: 'paper/:paperId', element: <PaperEntryPage /> },
    ],
  },
  {
    path: '/404',
    element: <div>Not Found</div>, // TODO: Create a 404 page
  },
]);

const App: React.FC = () => (
  <ThemeProvider theme={colors}>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
);

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
