import type React from 'react';
// import { useContext } from 'react';
import { Box, Button, ButtonGroup, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { type Paper, PaperState } from '@renderer/shared/utils/types';
// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import Favorite from '../favorite';
// import Relevancy from '../relevancy';
import { getColorShadeRedToGreen } from '../../../utils/getColorShade';
// import PaperAction, { RejectAction } from '../paper-action';
import { colors } from '@renderer/shared/styles/theme';
import type { Video } from '@renderer/shared/utils/types';

import defaultThumbnail from '@renderer/assets/arxiv-bg.jpg';

const thumbnailsPath = 'static://local.thumbnails';

export const getThumbnailUrl = (paper: any) => {
  // console.log('paper: ', paper);
  const video = paper.video as Video;
  return video?.thumbnailUrl ? `${thumbnailsPath}/${video?.thumbnailUrl}` : defaultThumbnail;
};

// const colors = {
//   0: 'rgba(237, 108, 3, 1)',
//   1: 'rgba(235, 235, 235, 1)',
//   2: 'rgba(47, 124, 49, 1)',
//   3: 'rgba(156, 39, 176, 1)',
// }

function Thumbnail({
  paper,
  shadow = false,
}: {
  paper: Paper;
  shadow?: boolean;
}): React.ReactElement {
  const navigate = useNavigate();

  const onThumbnailClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const is = (tag: string) => (e.target as HTMLElement).tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('LI');

    if (ignore) return;

    // console.log('paper: ', paper);
    navigate(`/paper/${paper.id}`);
  };

  const color = getColorShadeRedToGreen(paper);

  return (
    <Box
      onClick={onThumbnailClick}
      key={paper.id}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        width: '320px',
        height: '180px',
        border: `2px solid ${color}`,
        borderBottom: `10px solid ${color}`,
        // boxShadow: shadow ? '0px 2px 15px rgba(0, 0, 0, 0.6)' : 'none',
        '&:hover': {
          border: `2px solid ${colors.palette.secondary.main}`,
          borderBottom: `10px solid ${colors.palette.secondary.main}`,
        },
      }}
      className="thumb-img"
    >
      <img
        src={getThumbnailUrl(paper)}
        alt={paper.title}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          borderBottomRightRadius: '0px',
          borderBottomLeftRadius: '0px',
        }}
      />
      {/* <LikeBtn paper={paper} /> */}
      <Actions paper={paper} />
      <PaperTitle paper={paper} />
    </Box>
  );
}
function Actions({ paper }: { paper: Paper }): React.ReactElement {
  const notUploaded = (paper: Paper) => paper.status !== PaperState.published;
  const showReject = (paper: Paper) => paper.status === PaperState.approved;

  const onViewClick = (e) => {
    e.stopPropagation();

    window.open(`https://arxiv.org/abs/${paper.id}`, '_blank');
  };

  return (
    <>
      <ButtonGroup variant="outlined" aria-label="paper actions">
        {/* <Button onClick={onViewClick}>
          <Tooltip title='View on Arxiv'>
            <VisibilityIcon color="info" style={{ marginRight: '4px' }} />
          </Tooltip>
        </Button> */}
        {/*
        // notUploaded(paper) && (
          <>
            <PaperAction paper={paper} />
          {
            showReject(paper) && (
              <RejectAction paper={paper}/>
            )
          }
          </>
        // )
        */}
      </ButtonGroup>
      <div
        style={{
          position: 'absolute',
          // top: 0,
          // left: 0,
          bottom: 0,
          right: 0,
          // padding: '8px',
          backgroundColor: 'rgba(38,4,4,.95)',
          height: '2.3rem',
          // color: 'white',
          // textAlign: 'center',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
          zIndex: 999,
        }}
      >
        <Favorite paper={paper} />
      </div>
    </>
  );
}
// function LikeBtn ({ paper }: { paper: Paper }): React.ReactElement {
//   return (
//     <div style={{
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       // padding: '8px',
//       // backgroundColor: 'rgba(0, 0, 0, 0.6)', // Translucent black background
//       color: 'white',
//       // textAlign: 'center',
//       // borderBottomLeftRadius: '4px',
//       // borderBottomRightRadius: '4px',
//     }}>
//     </div>
//   )
// }
function PaperTitle({ paper }: { paper: Paper }): React.ReactElement {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Translucent black background
        color: 'white',
        textAlign: 'left',
      }}
    >
      {/* <Relevancy paper={paper}/> */}
      <span>{paper.title}</span>
    </div>
  );
}

export default Thumbnail;
