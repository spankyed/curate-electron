import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  ButtonGroup,
  Tooltip,
  Skeleton,
} from '@mui/material';
import { Paper, PaperState } from '@renderer/shared/utils/types';
import Favorite from '@renderer/shared/components/paper/favorite';
import Relevancy from '@renderer/shared/components/paper/relevancy';
import { paperStates } from '@renderer/shared/utils/paperStates';
import PaperAction, { RejectAction } from '@renderer/shared/components/paper/paper-action';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { colors } from '@renderer/shared/styles/theme';

const Row = ({ paper, index }) => {
  const statusType = paperStates[paper.status];
  const notUploaded = paper.status !== PaperState.published;
  const showReject = paper.status === PaperState.approved;

  return (
    <TableRow key={index}>
      <TableCell
        align="left"
        sx={{
          fontSize: '1.075rem',
          padding: 0,
          '&:hover': {
            backgroundColor: colors.palette.background.paper,
          },
        }}
      >
        <Link
          to={`/paper/${paper.id}`}
          style={{
            display: 'block',
            padding: '1em',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Relevancy paper={paper} />
          {paper.title}
        </Link>
      </TableCell>
      <TableCell align="center">
        <Favorite paper={paper} />
      </TableCell>
      {/* <TableCell align="center">
        <Chip 
          label={statusType.label} 
          color={statusType.color} 
          title={statusType.title}
        />
      </TableCell>
      <TableCell align="right">
        <ButtonGroup variant="text" aria-label="paper actions">
          {
            // notUploaded && (
              <PaperAction paper={paper} />
            // )
          }
          <Button>
            <Tooltip title='View'>
              <Link to={`/paper/${paper.id}`}>
                <VisibilityIcon color="info" style={{ marginRight: '4px' }} />
              </Link>
            </Tooltip>
          </Button>
          {
            showReject && (
              <RejectAction paper={paper}/>
            )
          }
        </ButtonGroup>
      </TableCell> */}
    </TableRow>
  );
};

const TablePlaceholder = ({ placeholderRows }) => {
  return (
    <>
      {Array.from(new Array(placeholderRows)).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton animation="wave" height={50} width="80em" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" height={50} width="2em" />
          </TableCell>
          {/* <TableCell>
            <Skeleton animation="wave" height={50} width="100%" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" height={50} width="100%" />
          </TableCell> */}
        </TableRow>
      ))}
    </>
  );
};

const PapersTable: React.FC<{
  papers?: Paper[];
  isLoading?: boolean;
  placeholderRows?: number;
}> = ({ papers = [], isLoading = false, placeholderRows = 5 }) => {
  return (
    <TableContainer sx={{ marginTop: 3, margin: '0 auto', minWidth: '100%' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Paper Title</TableCell>
            <TableCell align="left"></TableCell>
            {/* <TableCell align="center">Status</TableCell> */}
            {/* <TableCell align="right" style={{ paddingRight: '3em' }}>Actions</TableCell> */}
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            <TablePlaceholder placeholderRows={placeholderRows} />
          ) : (
            papers.map((paper, index) => <Row key={index} paper={paper} index={index} />)
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PapersTable;
