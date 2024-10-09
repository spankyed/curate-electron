import { Op } from 'sequelize'
import { MessagesTable, PdfDocumentTable, ThreadsTable } from '../../shared/schema'
import { serializeModel } from '@services/shared/utils/serialize-model'

function deleteMessage(messageId: string) {
  return MessagesTable.destroy({
    where: { id: messageId }
  })
}

function getAllThreads(paperId: string) {
  return ThreadsTable.findAll({
    where: { paperId },
    raw: true
  })
}

function getThread(threadId: string) {
  return ThreadsTable.findOne({
    where: { id: threadId },
    raw: true
  })
}

function findDuplicateDescriptions(paperId: string, description: string) {
  return ThreadsTable.findAll({
    where: {
      paperId,
      description: {
        [Op.startsWith]: description
      }
    },
    raw: true
  })
}

type MessageParams = {
  threadId: string
  messageId?: string
  includeHidden?: boolean
}
function getMessages({ threadId, messageId, includeHidden = false }: MessageParams) {
  console.log('threadId: ', threadId)
  const whereClause: { [key: string]: any } = {
    threadId
  }

  if (messageId) {
    whereClause.id = {
      [Op.lt]: messageId
    }
  }

  if (!includeHidden) {
    whereClause.hidden = false
  }

  return MessagesTable.findAll({
    where: whereClause,
    raw: true
  })
}

function getSingleMessage(messageId: string) {
  return MessagesTable.findOne({
    where: { id: messageId },
    raw: true
  })
}

function getPdfDocuments(paperId: string, viewMode = 0) {
  return PdfDocumentTable.findAll({
    where: {
      paperId,
      viewMode
    },
    raw: true
  })
}

function addPdfDocument(pdfDocument: any) {
  return PdfDocumentTable.create(pdfDocument).then(serializeModel)
}

function addMessage(message: any) {
  return MessagesTable.create(message).then(serializeModel)
}

function addMessagesBulk(messages: any[]) {
  return MessagesTable.bulkCreate(messages, { returning: true }).then(serializeModel)
}

function updateMessage(messageId: string, message: any) {
  return MessagesTable.update(message, {
    where: { id: messageId }
  })
}

function addThread(thread: any) {
  return ThreadsTable.create(thread).then(serializeModel)
  // {
  //   paperId,
  //   description,
  //   messageId,
  //   viewMode: 0
  // }
}

function toggleHideMessage(messageId: string, state: boolean) {
  return MessagesTable.update(
    { hidden: state },
    {
      where: { id: messageId }
    }
  )
}

export {
  deleteMessage,
  addMessage,
  addMessagesBulk,
  updateMessage,
  addThread,
  addPdfDocument,
  getAllThreads,
  getThread,
  getMessages,
  getSingleMessage,
  getPdfDocuments,
  toggleHideMessage,
  findDuplicateDescriptions
}
