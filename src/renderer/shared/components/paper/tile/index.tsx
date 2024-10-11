import { useAtom } from 'jotai';
import Thumbnail from './thumbnail';
import {
  anchorElAtom,
  isSummaryOpenAtom,
  popoverRefAtom,
  popoverTargetAtom,
  hoverTimeoutAtom,
} from './summary/store';
import { Paper } from '@renderer/shared/utils/types';

type TileProps = {
  paper: Paper;
  index?: number;
  currentPage?: number;
  previousPage?: number;
  imagesPerPage?: number;
  inCarousel?: boolean;
  shadow?: boolean;
};

function PaperTile({
  paper,
  currentPage,
  previousPage,
  imagesPerPage,
  index,
  shadow = false,
  inCarousel = false,
}: TileProps) {
  const [, setAnchorEl] = useAtom(anchorElAtom);
  const [, setIsOpen] = useAtom(isSummaryOpenAtom);
  const [popoverRef] = useAtom(popoverRefAtom);
  const [, setPaperTarget] = useAtom(popoverTargetAtom);
  const [hoverTimeout, setHoverTimeout] = useAtom(hoverTimeoutAtom);
  let isOffscreen = false;
  if (inCarousel) {
    const isCurrentPage =
      index! >= (currentPage! - 1) * imagesPerPage! && index! < currentPage! * imagesPerPage!;
    const isPreviousPage =
      index! >= (previousPage! - 1) * imagesPerPage! && index! < previousPage! * imagesPerPage!;
    isOffscreen = !isCurrentPage && !isPreviousPage;
  }

  const handleMouseOver = (paper) => (event: React.MouseEvent<HTMLElement>) => {
    const is = (tag) => (event.target as HTMLElement).tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('DIV');

    if (hoverTimeout) clearTimeout(hoverTimeout);

    if (ignore) {
      return;
    }

    const target = event.currentTarget; // ! javascript :)

    const timeoutId = setTimeout(() => {
      setPaperTarget(paper);
      setAnchorEl(target);
      setIsOpen(true);
    }, 10);

    setHoverTimeout(timeoutId);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);

    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !popoverRef?.contains(relatedTarget)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={isOffscreen ? 'offscreen-image' : ''}
      onMouseOver={handleMouseOver(paper)}
      onMouseLeave={handleMouseOut}
    >
      <Thumbnail paper={paper} shadow={shadow} />
    </div>
  );
}

export default PaperTile;
