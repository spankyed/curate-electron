import { PaperRecord, DateRecord } from "../../shared/types";

type DateRow = {
  date: DateRecord;
  papers: PaperRecord[];
};


function mapRecordsToModel(dates: DateRecord[], papers: PaperRecord[]): DateRow[] {
  const groupedPapers: DateRow[] = dates.map(date => ({
    date,
    papers: papers.filter(paper => paper.date === date.value),
  }));
  
  return groupedPapers.sort((a, b) => new Date(b.date.value).getTime() - new Date(a.date.value).getTime());
}

export {
  mapRecordsToModel,
}
