import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import * as api from '@renderer/shared/api/fetch';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

export default function PdfViewer({ paperId, width }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPdf = async (arxivId) => {
      try {
        const response = await api.fetchPdf(arxivId);
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf(paperId);
  }, [paperId]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage(event) {
    event.preventDefault();

    changePage(-1);
  }

  function nextPage(event) {
    event.preventDefault();

    changePage(1);
  }

  return (
    <div className="pdf-viewer p-2 h-full" style={{
      display: 'flex',
      flexDirection: 'column-reverse',
      alignSelf: 'center',
      minHeight: '5rem'
      }}>
      {
        !pdfUrl
        ? <Typography variant='h6'>Loading PDF...</Typography>
        : <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onError={(error) => console.error('Error loading document', error)}
            options={options}
          >
            <Page pageNumber={pageNumber} width={width} loading={<div>Loading...</div>}/>
          </Document>
      }
      
      <Pagination
        pageNumber={pageNumber}
        numPages={numPages}
        onPreviousPage={previousPage}
        onNextPage={nextPage}
      />
    </div>
  );
}

function Pagination({ pageNumber, numPages, onPreviousPage, onNextPage }) {
  return (
    <div className="page-controls">
      <button
        type="button"
        disabled={pageNumber <= 1}
        onClick={onPreviousPage}
      >
        ‹
      </button>
      <span>
        {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
      </span>
      <button
        type="button"
        disabled={pageNumber >= numPages}
        onClick={onNextPage}
      >
        ›
      </button>
    </div>
  );
}
