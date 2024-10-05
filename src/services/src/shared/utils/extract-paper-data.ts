import { parseStringPromise } from "xml2js";
import { TransformOptions, transformPaperModel } from "./transform-paper-model";
import { PaperRecord } from "../types";
import { formatDate } from "./date-formatter";

interface Paper {
  id: string;
  title: string;
  abstract: string;
  pdfLink: string;
  date: string;
  authors: string[];
}

export const extractPaperData = async (data: any, options?: TransformOptions): Promise<PaperRecord[]>  => {
  const parsedData = await parseStringPromise(data);
  const entries = parsedData.feed.entry || [];
  const date = options?.date;

  const rawPapers = entries.map((entry: any): Paper => ({
    id: extractIdFromUrl(entry.id[0]),
    title: entry.title[0],
    abstract: entry.summary[0],
    pdfLink: entry.link.find((link: any) => link.$.title === 'pdf').$.href,
    // date: entry.published[0],
    date: date || formatDate(entry.published[0]),
    authors: entry.author.map(
      (author: any) =>
        `${author.name[0]}`
    ),
  }));

  return transformPaperModel(rawPapers, options);
};


function extractIdFromUrl(url: string): string {
  // Use a regular expression to match the part of the URL after the last slash and before an optional version number
  const match = url.match(/\/([^\/]+?)(v\d+)?$/);
  if (match) {
    return match[1]; // The ID is in the first capturing group
  }

  return ''; // Return an empty string if no id is found
}
