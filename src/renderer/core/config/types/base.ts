import type dayjs from 'dayjs';

export type Day = dayjs.Dayjs | null;

export type PaperStatus = 0 | 1 | 2 | 3;

export type PaperState = 'pending' | 'scraping' | 'ranking' | 'complete';

export interface Paper {
  id?: string;
  title?: string;
  authors?: string[];
  date?: string;
  isStarred?: boolean;
  status?: PaperStatus;
  state?: PaperState;
  score?: number;
  video?: Video;
}

export interface Video {
  id?: string;
  title?: string;
  url?: string;
  thumbnail?: string;
}

export interface DateRow {
  month: string;
  dates: {
    value: string;
    papers: Paper[];
  }[];
}

export type CalendarModel = DateRow[];
