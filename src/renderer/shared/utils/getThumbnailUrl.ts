import { Video } from '@renderer/shared/utils/types';

// export const rootPath = 'http://localhost:5173/assets/arxiv-bg.jpg'
const rootAssetsPath = 'http://localhost:5173/assets/'

export const getThumbnailUrl = (paper: any) => {
  // console.log('paper: ', paper);
  const video = paper.video as Video;
  return video?.thumbnailUrl
    ? `${rootAssetsPath}thumbnails/${video?.thumbnailUrl}`
    : `${rootAssetsPath}thumbnails/default/arxiv-bg.jpg`
}
