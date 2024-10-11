import type { DatesTable, PapersTable } from '@services/shared/schema';
import type { PaperRecord, DateRecord } from '../../shared/types';

type DateRow = {
  date: DateRecord | DatesTable;
  papers: (PaperRecord | PapersTable)[];
};

function mapRecordsToModel(
  dates: DateRecord[] | DatesTable[],
  papers: PaperRecord[] | PapersTable[]
): DateRow[] {
  const groupedPapers: DateRow[] = dates.map((date) => ({
    date,
    papers: papers.filter((paper) => paper.date === date.value),
  }));

  return groupedPapers.sort(
    (a, b) => new Date(b.date.value).getTime() - new Date(a.date.value).getTime()
  );
}

export { mapRecordsToModel };
