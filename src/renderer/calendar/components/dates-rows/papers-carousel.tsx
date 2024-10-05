import React, { useState } from 'react';
import {  Button, Pagination,  } from '@mui/material';
import { Paper } from '@renderer/shared/utils/types';
import { resetDateStatusCalenderAtom } from '../../store';
import ResetState from '@renderer/shared/components/date/reset';
import PaperTile from '@renderer/shared/components/paper/tile';

function List({ papers, date }: { papers: Paper[]; date: string }): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(2);

  const handlePageChange = (event, value) => {
    setPreviousPage(currentPage);
    setCurrentPage(value);
  };

  const totalImages = papers.length;
  const imagesPerPage = 4;

  return (
    <div className="wrapper" style={{ margin: '1em' }}>
      <div className="carousel-container">
        {
          papers.length === 0 ? (
            <ResetState date={date} resetStatusAtom={resetDateStatusCalenderAtom}/>
          ) : (
            <>
              <Carousel
                papers={papers}
                imagesPerPage={imagesPerPage}
                previousPage={previousPage}
                currentPage={currentPage}
              />
              <div className="pagination-wrapper">
                <Pagination
                  count={Math.ceil(totalImages / imagesPerPage)}
                  shape="rounded"
                  color="secondary"
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            </>
          )
        }
      </div>
    </div>
  ); 
}

function Carousel({ papers, imagesPerPage, previousPage, currentPage }) {
  const emPxUnit = parseInt(getComputedStyle(document.documentElement).fontSize);
  const margin = 1; // in em, 1em = 16px
  const carouselWidth = imagesPerPage * (320 + (emPxUnit * margin * 2));

  return (
    <div
      className="carousel-wrapper"
      style={{ transform: `translateX(-${(currentPage - 1) * carouselWidth}px)` }}
    >
    {
      papers.map((paper, index) => {
        return (
          <PaperTile
            paper={paper}
            currentPage={currentPage}
            previousPage={previousPage}
            imagesPerPage={imagesPerPage}
            index={index}
            key={paper.id}
            inCarousel={true}
          />
        )
      })
    }
  </div>
  );
}

export default List;
