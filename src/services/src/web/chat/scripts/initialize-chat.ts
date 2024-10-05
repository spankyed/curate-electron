import * as repository from '../repository';
import getPdfText from './get-pdf-text';

export default async function initializeChat(paperId: string) {
  const pdfDoc = await repository.getPdfDocuments(paperId);

  if (!pdfDoc.length) {
    const pdfText = await getPdfText(paperId);
    await repository.addPdfDocument({
      paperId,
      viewMode: 0,
      content: pdfText
    });

    return pdfText.length;
  }

  return pdfDoc[0].content.length; // todo alter index based on current view mode
}
