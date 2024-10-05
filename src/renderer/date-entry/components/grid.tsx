import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { PlaceholderList } from '@renderer/calendar/components/placeholder';
import PaperTile from '@renderer/shared/components/paper/tile';
import { isSummaryOpenAtom } from '@renderer/shared/components/paper/tile/summary/store';
import SummaryPopover from '@renderer/shared/components/paper/tile/summary/summary';
// import { Link } from 'react-router-dom';
import { Paper } from '@renderer/shared/utils/types';

const ThumbPapersGrid: React.FC<{ papers: Paper[]; isLoading: boolean; placeholderRows?: number }> = ({
  papers,
  isLoading = false,
  placeholderRows = 4
}) => {
  const [, setSummaryOpen] = useAtom(isSummaryOpenAtom);
  useEffect(() => () => setSummaryOpen(false), []); // Close the summary popover on unmount

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2em',
      marginBottom: '2em',
      paddingTop: '1rem',
      justifyContent: 'space-between',
    }}>
      {
        isLoading
        ? <GridPlaceholder placeholderRows={placeholderRows}/>
        : <>
            {
              papers.map((paper, index) => (
                <div key={`${paper.id}-${index}`}>
                  <PaperTile paper={paper} shadow={true}/>
                </div>
              ))
            }
          </>
      }
      <SummaryPopover/>
    </div>
  );
}

const GridPlaceholder = ({ placeholderRows }) => {
  return (
    <>
      {Array(placeholderRows).fill(null).map((_, index) => (
          <PlaceholderList key={index}/>
      ))}
    </>
  );
}

export default ThumbPapersGrid;
