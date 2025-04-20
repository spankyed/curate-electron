// export type RecordTypes = DateRecord | PaperRecord | { lastRun: string };
// export type DateStatuses = 'pending' | 'scraping' | 'ranking' | 'complete';

export enum DateStatuses {
  PENDING = 'pending',
  SCRAPING = 'scraping',
  RANKING = 'ranking',
  COMPLETE = 'complete',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}

export type PaperStatuses = 0 | 1 | 2 | 3;

// export enum PaperStatuses {
//   UNSPECIFIED = 0,
//   APPROVED = 1,
//   GENERATED = 2,
//   PUBLISHED = 3,
// }

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
