import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Pagination, Typography } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import SummaryPopover from '@renderer/shared/components/paper/tile/summary/summary';
import { calendarLoadMoreAtom, calendarModelAtom, lastRecordReachedAtom, scrollableContainerRefAtom, updatePaperInCalenderAtom } from '../../store';
import { scrollToElement } from '@renderer/shared/utils/scrollPromise';
import RowItem from './row-item';
import { isSummaryOpenAtom } from '../../../shared/components/paper/tile/summary/store';
import { emptyObjectAtom } from '@renderer/shared/store';

function DateRows(): React.ReactElement {
  const datesAtoms = useAtomValue(calendarModelAtom);
  const [scrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  const [, setSummaryOpen] = useAtom(isSummaryOpenAtom);

  const hasDates = datesAtoms.length > 0;
  const lastDateAtom = hasDates ? datesAtoms[datesAtoms.length - 1] : emptyObjectAtom;
  const dbCursor = useAtomValue(lastDateAtom)
  const datesLength = datesAtoms.length;
  const updatePaper = useSetAtom(updatePaperInCalenderAtom);

  useEffect(() => {
    const handlePaperUpdate = (event) => {
      updatePaper(event.detail)
    }

    window.addEventListener('paperUpdate', handlePaperUpdate);

    return () => {
      setSummaryOpen(false);
      window.removeEventListener('paperUpdate', handlePaperUpdate);
    };
  }, []);

  useEffect(() => {
    const scrollableElement = scrollableContainerRef?.current;

    if (!scrollableElement) {
      return;
    }

    if (datesLength === 5) {
      // scrolling to the top when completely replacing list
      scrollableElement.scrollTo({ top: 0, behavior: 'smooth' })

      return;
    };
    // scroll to the last element
    const scrollPosition = scrollableElement.scrollHeight;
    scrollableElement.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  }, [datesLength]);
  
  return (
    <>
      <SummaryPopover/>

      {datesAtoms.map((dateAtom, index) => {
        const isFocalElement = index === datesAtoms.length - 1;
        // ! using index is bad, if we add item at beginning it will re-render all items
        return (
          <RowItem dateAtom={dateAtom} isFocalElement={isFocalElement} key={`date-${index}`}/>
        );
      })}

      <LoadMoreButton dbCursor={dbCursor?.date?.value} />
    </>
  );
}

const LoadMoreButton = ({ dbCursor }) => {
  const [, loadNextPage] = useAtom(calendarLoadMoreAtom);
  const [lastRecordReached] = useAtom(lastRecordReachedAtom);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!isLoading) {
      setIsLoading(true);

      await loadNextPage(dbCursor);

      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center mt-8 pb-16">
      <Button
        variant="contained"
        color="secondary"
        disabled={isLoading || lastRecordReached}
        onClick={handleClick} // Pass the function directly
        className="text-white bg-red-500 hover:bg-red-700 ... your tailwind classes here ..."
      >
        {
          isLoading
            ? <CircularProgress size={24} color="inherit" />
            : (
              lastRecordReached
                ? 'All records loaded'
                : 'Load More'
            )
        }
      </Button>
    </div>
  );
};

export default DateRows;
