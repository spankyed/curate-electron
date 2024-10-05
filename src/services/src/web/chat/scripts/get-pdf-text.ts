import { pdfToText } from 'pdf-ts';
import axios from 'axios';

// todo consider using https://jina.ai/reader/
async function getPdfText(arxivId: string): Promise<string> {
  const response = await axios.get(`http://export.arxiv.org/pdf/${arxivId}`, {
    responseType: 'arraybuffer'
});

const text = await pdfToText(response.data);

return cleanText(text);
}

function cleanText(text: string): string {
  text = text.replace(/\\(textbf|textit|cite|ref){(.*?)}/gi, "$2")
              .replace(/[\r\n]+/g, '\n') // Normalize newlines
              .replace(/-\n/g, '')       // Concatenate hyphenated words split across lines
              .replace(/\n/g, ' ')       // Replace newlines with spaces to form paragraphs
              .replace(/ {2,}/g, ' ')    // Replace multiple spaces with a single space
              .replace(/\s+\./g, '.')    // Remove space before punctuation
              .replace(/\s+,/g, ',')
              .trim();                   // Trim whitespace from start and end

  return text;
}

export default getPdfText;
