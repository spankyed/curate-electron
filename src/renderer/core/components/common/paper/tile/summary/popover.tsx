import type React from 'react';
import { useEffect, useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { getColorShadeRedToGreen } from '@renderer/core/utils/getColorShade';
import { useAtom } from 'jotai';
import {
  anchorElAtom,
  isSummaryOpenAtom,
  popoverTargetAtom,
  popoverRefAtom,
  hoverTimeoutAtom,
} from './store';
import { roundScore } from '@renderer/core/utils/roundScore';
import { useNavigate } from 'react-router-dom';
import type { Paper as PaperType } from '@renderer/core/utils/types';

const PADDING = -8;
const MAX_ABSTRACT_LENGTH = 900;

const PopoverText = styled(Paper)(({ theme }) => ({
  maxWidth: '400px',
  padding: theme.spacing(2),
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
}));

const ScoreDiv = styled(Box)<{ paper: PaperType }>(({ theme, paper }) => {
  const bgColor = getColorShadeRedToGreen(paper);
  const textColor = bgColor === 'white' ? '#000' : theme.palette.common.white;
  return {
    display: 'inline-block',
    float: 'left',
    backgroundColor: getColorShadeRedToGreen(paper),
    color: textColor,
    borderRadius: theme.shape.borderRadius,
    padding: '4px 8px',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    margin: '0 12px 0px 0',
    filter: 'brightness(0.9)',
  };
});

const SummaryPopover: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useAtom(isSummaryOpenAtom);
  const [anchorEl] = useAtom(anchorElAtom);
  const [popoverRef, setPopoverRefAtom] = useAtom(popoverRefAtom);
  const [paper] = useAtom(popoverTargetAtom);
  const { relevancy: score } = paper || { relevancy: 0 };
  const [abstract, setAbstract] = useState(paper?.abstract || '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoverTimeout, _] = useAtom(hoverTimeoutAtom);

  const popoverRefCallback = (node: HTMLButtonElement | null) => {
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
  }, [paper?.abstract]);

  useEffect(() => {
    if (isOpen && anchorEl && popoverRef) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const popoverRect = popoverRef.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate horizontal position
      let left = anchorRect.left + (anchorRect.width - popoverRect.width) / 2;
      left = Math.max(0, Math.min(left, windowWidth - popoverRect.width));

      // Calculate vertical position
      const topSpot = anchorRect.top - popoverRect.height - PADDING;
      const bottomSpot = anchorRect.bottom + PADDING;
      const cantFitAbove = topSpot < 0;
      const cantFitBelow = bottomSpot + popoverRect.height > windowHeight;

      let top: number;
      if (cantFitAbove) {
        if (cantFitBelow) {
          const overHalfWayDown = anchorRect.top + anchorRect.height / 2 > windowHeight / 2;
          top = overHalfWayDown ? topSpot + 11 : bottomSpot + 12;
        } else {
          top = bottomSpot + 12;
        }
      } else {
        top = topSpot + 11;
      }

      popoverRef.style.left = `${left}px`;
      popoverRef.style.top = `${top}px`;
    }

    return () => {
      if (popoverRef) {
        popoverRef.style.left = '';
        popoverRef.style.top = '';
      }
    };
  }, [isOpen, anchorEl, popoverRef]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const is = (tag: string) => (e.target as HTMLElement).tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('LI');

    if (ignore) return;
    navigate(`/paper/${paper?.id}`);
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={handleClick}
          onMouseLeave={handleMouseOut}
          ref={popoverRefCallback}
          style={{
            position: 'fixed',
            zIndex: 9999,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            width: 'auto',
            minWidth: '400px',
            maxWidth: '400px',
            textAlign: 'left',
          }}
        >
          <PopoverText>
            <ScoreDiv paper={paper as PaperType}>{`${roundScore(score)}%`}</ScoreDiv>
            <Typography variant="body2">
              {abstract.length > MAX_ABSTRACT_LENGTH
                ? `${abstract.slice(0, MAX_ABSTRACT_LENGTH)}...`
                : abstract}
            </Typography>
          </PopoverText>
        </button>
      )}
    </>
  );
};

export default SummaryPopover;
