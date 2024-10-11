import { pdfToText } from 'pdf-ts';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const axiosWithRetry = axios.create();

(axiosRetry as any).default(axiosWithRetry, {
  retries: 3, // Number of retries
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 1000; // Wait 1s, 2s, 3s between retries
  },
  retryCondition: (error) => {
    // Retry on connection reset or server errors (5xx)
    return Boolean(
      error.code === 'ECONNRESET' || (error.response?.status && error.response.status >= 500)
    );
  },
});

// todo consider using https://jina.ai/reader/
async function getPdfText(arxivId: string): Promise<string> {
  try {
    const response = await axiosWithRetry.get(`http://export.arxiv.org/pdf/${arxivId}`, {
      responseType: 'arraybuffer',
    });

    const text = await pdfToText(response.data);
    return cleanText(text);
  } catch (error) {
    console.error(`Failed to fetch PDF with retry: ${error}`);
    throw error; // Re-throw after logging if needed
  }
}

function cleanText(text: string): string {
  text = text
    .replace(/\\(textbf|textit|cite|ref){(.*?)}/gi, '$2')
    .replace(/[\r\n]+/g, '\n') // Normalize newlines
    .replace(/-\n/g, '') // Concatenate hyphenated words split across lines
    .replace(/\n/g, ' ') // Replace newlines with spaces to form paragraphs
    .replace(/ {2,}/g, ' ') // Replace multiple spaces with a single space
    .replace(/\s+\./g, '.') // Remove space before punctuation
    .replace(/\s+,/g, ',')
    .trim(); // Trim whitespace from start and end

  return text;
}

export default getPdfText;
