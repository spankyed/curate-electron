import { useAtom } from 'jotai';
import { pdfModalOpen } from '../store';
import ModalWrapper from '@renderer/shared/components/modal';
import PdfViewer from './pdf-viewer';
import { useEffect, useState } from 'react';

function PdfModal({ paperId }) {
  const [open, setOpen] = useAtom(pdfModalOpen);
  const handleClose = () => setOpen(false);
  const [width, setCalculatedWidth] = useState(750); // Default width
  const [viewportWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
    };

    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  useEffect(() => {
    const calculatedWidth = viewportWidth > 1024 ? viewportWidth * 0.48 : 750;
    setCalculatedWidth(calculatedWidth);
  }, [window.innerWidth]);

  return (
    <ModalWrapper open={open} handleClose={handleClose} width={width}>
      <PdfViewer paperId={paperId} width={width - 75} />
    </ModalWrapper>
  );
}

export default PdfModal;
