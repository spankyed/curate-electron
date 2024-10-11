import React from 'react';
import { Tooltip, Button } from '@mui/material';
import { PaperState } from '../../utils/types';

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PublishIcon from '@mui/icons-material/Publish';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import * as api from '@renderer/shared/api/fetch';

const updateStatus = (status: keyof typeof PaperState) => (paper) => async () => {
  const id = paper.id;
  if (!id) {
    return;
  }

  const newStatus = PaperState[status];

  await api.updatePaperStatus(id, newStatus);

  const event = new CustomEvent('paperUpdate', {
    detail: {
      id,
      date: paper.date,
      changes: { field: 'status', value: newStatus },
    },
  });

  window.dispatchEvent(event);
};

const actions = {
  approve: {
    title: 'Approve',
    icon: <CheckOutlinedIcon color="warning" />,
    handler: updateStatus('approved'),
  },
  generate: {
    title: 'Generate',
    icon: <EditNoteOutlinedIcon color="success" />,
    handler: updateStatus('generated'),
  },
  upload: {
    title: 'Upload',
    icon: <PublishIcon color="secondary" />,
    handler: updateStatus('published'),
  },
  view: {
    title: 'View',
    icon: <div>View</div>,
    handler: () => {},
  },
  // updating: {
  //   title: 'updating',
  //   icon: <div>updating</div>,
  //   handler: () => {},
  // },
  reject: {
    title: 'Undo Approval',
    icon: <ClearOutlinedIcon color="error" style={{ marginRight: '4px' }} />,
    handler: updateStatus('initial'),
  },
};

const ActionComponent = ({ type, paper }) => {
  const action = actions[type];

  return (
    <Button onClick={action.handler(paper)}>
      <Tooltip title={action.title}>{action.icon}</Tooltip>
    </Button>
  );
};

const PaperAction = ({ paper }) => {
  const state = paper.status;

  const renderAction = () => {
    switch (state) {
      case PaperState.initial:
        return <ActionComponent type="approve" paper={paper} />;
      case PaperState.approved:
        return <ActionComponent type="generate" paper={paper} />;
      case PaperState.generated: // from generated status, consider a draft action instead of upload/publish action
        return <ActionComponent type="upload" paper={paper} />;
      case PaperState.published:
        return <ActionComponent type="view" paper={paper} />;
      default:
        return <div>Unknown State</div>;
    }
  };

  return <>{renderAction()}</>;
};

const RejectAction = ({ paper }) => <ActionComponent type="reject" paper={paper} />;

export { RejectAction };
export default PaperAction;
