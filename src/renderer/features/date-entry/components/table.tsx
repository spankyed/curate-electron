import type React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';
import type { Paper } from '@renderer/core/utils/types';
import Favorite from '@renderer/core/components/common/paper/favorite';
import Relevancy from '@renderer/core/components/common/paper/relevancy';
import { colors } from '@renderer/core/styles/theme';

interface RowProps {
  paper: Paper;
}

const Row: React.FC<RowProps> = ({ paper }) => {
  return (
    <TableRow key={paper.id}>
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
    </TableRow>
  );
};

interface TablePlaceholderProps {
  placeholderRows: number;
}

const TablePlaceholder: React.FC<TablePlaceholderProps> = ({ placeholderRows }) => {
  return (
    <>
      {Array.from({ length: placeholderRows }, (_, i) => (
        <TableRow key={`placeholder-row-${i + 1}`}>
          <TableCell>
            <Skeleton animation="wave" height={50} width="80em" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" height={50} width="2em" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

interface PapersTableProps {
  papers?: Paper[];
  isLoading?: boolean;
  placeholderRows?: number;
}

const PapersTable: React.FC<PapersTableProps> = ({ papers = [], isLoading = false, placeholderRows = 5 }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="center">Favorite</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TablePlaceholder placeholderRows={placeholderRows} />
          ) : (
            papers.map((paper) => (
              <Row key={paper.id} paper={paper} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PapersTable;
