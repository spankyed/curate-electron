// import './assets/main.css'

import type React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'jotai';
import { colors } from './shared/styles/theme';
import Layout from './shared/components/layout';
import CalendarPage from './calendar';
import DateEntryPage from '@renderer/date-entry';
import PaperEntryPage from '@renderer/paper-entry';
import SearchPage from '@renderer/search';
import OnboardPage from '@renderer/onboard';
import BackfillPage from '@renderer/backfill';
import './shared/styles/index.css';
import { ErrorBoundary } from 'react-error-boundary';
import DevErrorBoundary from '@renderer/shared/error/dev';

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
