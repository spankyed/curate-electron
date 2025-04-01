import { IconButton } from '@mui/material';
// import { Paper } from '@renderer/core/utils/types';

// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { updateIsStarred } from '@renderer/core/api/fetch';
// import { useState } from "react";
import { Paper } from '@renderer/core/utils/types';

function Favorite({ paper = {} }: { paper?: Partial<Paper> }): React.ReactElement {
  const handleUpdateIsStarred = async () => {
    const id = paper.id;
    if (!id) {
      return;
    }

    const newState = !paper.isStarred;
    await updateIsStarred(id, newState);

    const event = new CustomEvent('paperUpdate', {
      detail: {
        id,
        date: paper.date,
        changes: { field: 'isStarred', value: newState },
      },
    });

    window.dispatchEvent(event);
  };

  return (
    <IconButton onClick={handleUpdateIsStarred}>
      {paper.isStarred ? <StarOutlinedIcon /> : <StarBorderOutlinedIcon />}
    </IconButton>
  );
}

export default Favorite;
