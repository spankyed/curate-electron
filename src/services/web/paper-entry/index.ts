import * as repository from './repository'
import * as sharedRepository from '@services/shared/repository'
import axios from 'axios'

async function paperById(paperId) {
  const papers = await repository.getPaperById(paperId)
  return papers
}

async function starPaper(paperId, isStarred) {
  const result = await repository.updatePaperField(paperId, 'isStarred', isStarred)

  try {
    if (isStarred) {
      const paper = await repository.getPaperById(paperId)
      Promise.all([
        sharedRepository.chroma.storeReferencePaperChroma(paper),
        repository.storeReferencePaper(paperId)
      ])
    } else {
      Promise.all([
        repository.chroma.deleteReferencePaperChroma(paperId),
        repository.deleteReferencePaper(paperId)
      ])
    }
  } catch (err) {
    console.error(`Unable to update reference paper ${paperId} - ${isStarred}`, err)
    // if storing fails need to revert the isStarred field
    // await repository.updatePaperField(paperId, 'isStarred', !isStarred);
  }

  return result
}

async function updatePaperStatus(paperId, status) {
  const papers = await repository.updatePaperField(paperId, 'status', status)

  return papers
}

async function fetchPdf(arxivId) {
  try {
    const response = await axios.get(`http://export.arxiv.org/pdf/${arxivId}`, {
      responseType: 'stream'
    })

    return response.data
    // return h.response(response.data).type('application/pdf');
  } catch (error) {
    console.error('Error fetching PDF from arXiv:', error)
    return { error: 'Error fetching PDF from arXiv', code: 500 }
  }
}

export default {
  'fetch-pdf': fetchPdf,
  'paper-by-id': paperById,
  'star-paper': starPaper,
  'update-paper-status': updatePaperStatus
}
