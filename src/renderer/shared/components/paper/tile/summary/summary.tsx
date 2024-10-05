import React, { useEffect, useState } from 'react';
import { Paper, Typography, Fade, Badge, Box } from '@mui/material';
import { styled } from '@mui/system';
import { getColorShadeRedToGreen } from '../../../../utils/getColorShade';
import { useAtom } from 'jotai';
import { anchorElAtom, isSummaryOpenAtom, popoverTargetAtom, popoverRefAtom, hoverTimeoutAtom } from './store';
import { colors } from '@renderer/shared/styles/theme';
import { roundScore } from '@renderer/shared/utils/roundScore';

const padding = -8;

const PopoverText = styled(Paper)(({ theme }) => ({
  maxWidth: '400px',
  padding: theme.spacing(2),
  // backgroundColor: colors.sidebar,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  // transition: 'opacity 0.2s ease-in-out',
}));

const ScoreDiv = styled(Box)<{ paper: any }>(({ theme, paper }) => {
  const bgColor = getColorShadeRedToGreen(paper);
  const textColor = bgColor === 'white' ? '#000' : theme.palette.common.white; 
  return ({
    display: 'inline-block',
    float: 'left', // Ensures the text wraps around the div
    backgroundColor: getColorShadeRedToGreen(paper),
    color: textColor,
    borderRadius: theme.shape.borderRadius,

    // backgroundColor: colors.palette.background.paper,
    padding: '4px 8px',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    // boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.35)', // Add shadow for contrast
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', // subtle text shadow for depth
    margin: '0 12px 0px 0', // Margin for wrapping text around the div
    // black tint
    filter: 'brightness(0.9)',
  });
});

const SummaryPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isSummaryOpenAtom);
  const [anchorEl] = useAtom(anchorElAtom);
  const [popoverRef, setPopoverRefAtom] = useAtom(popoverRefAtom);
  const [paper] = useAtom(popoverTargetAtom);
  let { relevancy: score } = paper || { relevancy: 0 };
  const [abstract, setAbstract] = useState(paper?.abstract || '');
  const [hoverTimeout, setHoverTimeout] = useAtom(hoverTimeoutAtom);

  const popoverRefCallback = (node: HTMLDivElement | null) => {
    setPopoverRefAtom(node);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);

    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!popoverRef?.contains(relatedTarget) && relatedTarget) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setAbstract(paper?.abstract || '');
  }, [paper]);
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    if (isOpen && anchorEl && popoverRef) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const popoverRect = popoverRef.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let left = anchorRect.left + (anchorRect.width - popoverRect.width) / 2;

      if (left < 0) {
        left = 0;
      } else if (left + popoverRect.width > windowWidth) {
        left = windowWidth - popoverRect.width;
      }

      // let estimatedHeight = paper?.abstract.length * .4; // todo figure out way to estimate height with all the text
      let estimatedHeight = popoverRect.height;
      let topSpot = anchorRect.top - estimatedHeight - padding;
      let bottomSpot = anchorRect.bottom + padding;
      let top;

      const putAbove = () => (top = topSpot + 11);
      const putBelow = () => (top = bottomSpot + 12);

      const cantFitAbove = topSpot < 0;
      const cantFitBelow = bottomSpot + estimatedHeight > windowHeight;
      if (cantFitAbove) {
        if (cantFitBelow) {
          const overHalfWayDown = (anchorRect.top + anchorRect.height / 2) > windowHeight / 2;
          
          if (overHalfWayDown) {
            putAbove()
          } else {
            putBelow()
          }

          const sizeBase = overHalfWayDown ?  anchorRect.y : windowHeight - bottomSpot;
          const randomHeightMultiplier = 2.3; // tried to relate text length to height
          setAbstract(slice(paper?.abstract, sizeBase * randomHeightMultiplier) + '...');
      } else {
          putBelow()
        }
      } else {
        putAbove()
      }

      popoverRef.style.left = `${left}px`;
      popoverRef.style.top = `${top}px`;
    }
  }, [anchorEl, popoverRef, abstract]);


  return (
    <>
      {isOpen &&
        <div
          onMouseLeave={handleMouseOut}
          ref={popoverRefCallback}
          style={{
            position: 'absolute',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
        <PopoverText>
          <ScoreDiv paper={paper}>
            {`${roundScore(score)}%`}
          </ScoreDiv>
          <Typography variant="body2">
            {abstract}
          </Typography>
        </PopoverText>
        </div>
      }
    </>
  );
};

export default SummaryPopover;

function slice (str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}



