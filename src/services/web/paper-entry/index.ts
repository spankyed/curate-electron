import * as repository from './repository';
import * as sharedRepository from '@services/shared/repository';
import axios from 'axios';
import path from 'node:path';
// import fs from 'node:fs'
import fs from 'node:fs/promises'; // Use fs/promises for promise-based functions
import { existsSync } from 'node:fs'; // Synchronous fs methods (existsSync and mkdirSync)
import { arxivPdfDir, getServerAddress } from '@main/handle-static-files';

async function paperById(paperId) {
  const papers = await repository.getPaperById(paperId);
  return papers;
}

async function starPaper(paperId, isStarred) {
  const result = await repository.updatePaperField(paperId, 'isStarred', isStarred);

  try {
    if (isStarred) {
      const paper = await repository.getPaperById(paperId);
      Promise.all([
        sharedRepository.chroma.storeReferencePaperChroma(paper),
        repository.storeReferencePaper(paperId),
      ]);
    } else {
      Promise.all([
        repository.chroma.deleteReferencePaperChroma(paperId),
        repository.deleteReferencePaper(paperId),
      ]);
    }
  } catch (err) {
    console.error(`Unable to update reference paper ${paperId} - ${isStarred}`, err);
    // if storing fails need to revert the isStarred field
    // await repository.updatePaperField(paperId, 'isStarred', !isStarred);
  }

  return result;
}

async function updatePaperStatus(paperId, status) {
  const papers = await repository.updatePaperField(paperId, 'status', status);

  return papers;
}

async function fetchPdf(arxivId) {
  const pdfPath = path.join(arxivPdfDir, `${arxivId}.pdf`);

  try {
    if (!existsSync(pdfPath)) {
      const pdfPath = path.join(arxivPdfDir, `${arxivId}.pdf`);

      const response = await axios.get(`http://export.arxiv.org/pdf/${arxivId}`, {
        responseType: 'arraybuffer',
      });

      const expectedLength = Number.parseInt(response.headers['content-length'], 10);
      const actualLength = response.data.byteLength;
      if (actualLength !== expectedLength) {
        throw new Error(
          `Content length mismatch: expected ${expectedLength}, but got ${actualLength}`
        );
      }

      await fs.writeFile(pdfPath, Buffer.from(response.data));

      console.log(`Downloaded and saved PDF: ${pdfPath}`);

      const address = getServerAddress();
      if (typeof address === 'string') {
        const serverPath = `${address}/${arxivId}.pdf`;
        // console.log('localhost path: ', serverPath);
        return serverPath;
      }

      throw new Error('Failed to retrieve server address');
    }

    console.log(`PDF already exists: ${pdfPath}`);

    const address = getServerAddress();
    if (typeof address === 'string') {
      const serverPath = `${address}/${arxivId}.pdf`;
      console.log('serverPath: ', serverPath);
      return serverPath;
    }

    throw new Error('Failed to retrieve server address');
  } catch (error) {
    console.error('Error fetching PDF from arXiv:', error);
  }

  return { error: 'Error fetching PDF from arXiv', code: 500 };
}

export default {
  'fetch-pdf': fetchPdf,
  'paper-by-id': paperById,
  'star-paper': starPaper,
  'update-paper-status': updatePaperStatus,
};
