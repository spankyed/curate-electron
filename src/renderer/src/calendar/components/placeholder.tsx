import React, { useState } from 'react';
import { Box } from '@mui/material';
import { colors } from '@renderer/shared/styles/theme';

function DatesPlaceholder(): React.ReactElement {
  const fakeDates = Array(3).fill(null);

  return (
    <>
      {fakeDates.map((_, index) => (
        <Box 
          key={'date-placeholder-' + index}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            paddingTop: 2,  
            paddingBottom: 2,
            cursor: 'pointer',
            margin: '.5rem 2rem',
          }}
        >
          <div 
          style={{ 
            width: '188px', height: '45px',
            marginBottom: '4px',
            marginTop: '.6em',
            backgroundColor: colors.palette.background.paper,
            // background: '#FE6B8B', // Adjust the gradient colors as needed
            padding: '.25em 1em .25em 1em',
            borderRadius: '5px',
            transform: 'skewX(-5deg)', // Adds a slant to the text
            display: 'inline-block', // Necessary for transform
            // boxShadow: '2px 2px 10px rgba(106, 48, 147, 0.4)', // Soft shadow with a color that matches the gradient
          }}
          ></div>

          <PlaceholderList />

          <div
            style={{ 
              width: '17rem',
              height: '1.2rem',
              backgroundColor: colors.palette.background.paper,
              marginBottom: '1em',
              marginTop: '1.5rem'
            }}
          ></div>
        </Box>
      ))}
    </>
  );
}

export function PlaceholderList(): React.ReactElement {
  const fakeThumbs = Array(4).fill(null);

  return (
    <div className="wrapper w-full">
      <div className="carousel-container">
        <div className="carousel-wrapper flex justify-between">
          {fakeThumbs.map((_, index) => (
            <div className="placeholder-thumbnail" key={index}>
              <ThumbnailPlaceholder />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ThumbnailPlaceholder({ shadow = false }): React.ReactElement {
  return (
    <div
      style={{ 
        position: 'relative', 
        width: '320px', 
        height: '180px',  
        backgroundColor: colors.palette.background.paper,
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        boxShadow: shadow ? `0px 2px 15px rgba(0, 0, 0, 0.6)` : 'none',
        padding: '1em',
      }}
      className='thumb-img'
    >
      {/* Placeholder content can go here if needed */}
    </div>
  )
}

export default DatesPlaceholder;
