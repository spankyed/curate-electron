
// export type RecordTypes = DateRecord | PaperRecord | { lastRun: string };
export type DateStatuses = 'pending' | 'scraping' | 'ranking' | 'complete';
export type PaperStatuses = 0 | 1 | 2 | 3;
export type TableTypes = {
  dates: DateRecord;
  papers: PaperRecord;
  // config: { lastRun: string };
};

export type DateRecord = {
  value: string;
  status: DateStatuses;
  count?: number;
};
export type PaperRecord = {
  id: string;
  date: string;
  title: string;
  abstract: string;
  pdfLink: string; // todo remove property as it can be derived from id
  authors?: string[];
  relevancy: number;
  isStarred?: boolean;
  keywords?: string[];
  status: PaperStatuses;
  // video?: {
  //   title: string;
  //   description: string;
  //   thumbnailPrompt: string;
  //   scriptPrompt: string;
  //   videoUrl: string;
  //   thumbnailUrl: string;
  // };
};

// interface Paper {
//   id: string;
//   date: string;
//   title: string;
//   abstract: string;
//   pdfLink: string;
//   authors: string[];
// }
