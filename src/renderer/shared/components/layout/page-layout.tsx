import React, { useState, useEffect, ReactNode, createRef } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { forwardRef } from 'react';
import { colors } from '@renderer/shared/styles/theme';

interface PageLayoutProps {
  children: ReactNode;
  compact?: boolean;
  [key: string]: any;
}

const height = 'calc(100vh - 65px)';

const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, compact = true, ...props }, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [showScroll, setShowScroll] = useState(false);
    ref = ref || createRef<HTMLDivElement>();

    const checkScrollTop = () => {
      if (ref && 'current' in ref && ref.current) {
        const { scrollTop } = ref.current;
        setShowScroll(scrollTop > 200);
      }
    };

    useEffect(() => {
      const element = ref && 'current' in ref ? ref.current : null;

      if (element) {
        element.addEventListener('scroll', checkScrollTop);
        return () => element.removeEventListener('scroll', checkScrollTop);
      }
    }, [ref]);

    const scrollTop = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    return (
      <Box
        ref={ref} // Use the forwarded ref
        sx={{
          overflowY: 'auto',
          flexGrow: 1,
          height,
          justifyContent: 'center',
          display: 'flex',
          overflowAnchor: 'none',
        }}
        {...props}
      >
        <div
          style={{
            width: compact ? '90%' : '100%',
            display: 'flex',
            flexDirection: 'column',
            // padding: compact ? 2 : 4,
          }}
        >
          {children}
          {showScroll && (
            <Fab
              color="secondary"
              size="small"
              onClick={scrollTop}
              sx={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
              }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          )}
        </div>
      </Box>
    );
  }
);

export default PageLayout;
