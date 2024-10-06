import { Op } from "sequelize";
import { MessagesTable, PdfDocumentTable, ThreadsTable } from "../../shared/schema";

function deleteMessage(messageId: string) {
  return MessagesTable.destroy({
    where: { id: messageId }
  });
}

function getAllThreads(paperId: string) {
  return ThreadsTable.findAll({
    where: { paperId }
  });
}

function getThread(threadId: string) {
  return ThreadsTable.findOne({
    where: { id: threadId }
  });
}

function findDuplicateDescriptions(paperId: string, description: string) {
  return ThreadsTable.findAll({
    where: {
      paperId,
      description: {
        [Op.startsWith]: description
      }
    }
  });
}

type MessageParams = {
  threadId: string;
  messageId?: string;
  includeHidden?: boolean;
}
function getMessages({ threadId, messageId, includeHidden = false }: MessageParams) {
  const whereClause: { [key: string]: any } = {
    threadId
  };

  if (messageId) {
    whereClause.id = {
      [Op.lt]: messageId
    }
  }

  if (!includeHidden) {
    whereClause.hidden = false;
  }

  return MessagesTable.findAll({
    where: whereClause
  });
}

function getSingleMessage(messageId: string) {
  return MessagesTable.findOne({
    where: { id: messageId }
  });
}

function getPdfDocuments(paperId: string, viewMode = 0){
  return PdfDocumentTable.findAll({
    where: {
      paperId,
      viewMode
    }
  });
}

function addPdfDocument(pdfDocument: any) {
  return PdfDocumentTable.create(pdfDocument);
}

function addMessage(message: any) {
  return MessagesTable.create(message);
}

function addMessagesBulk(messages: any[]) {
  return MessagesTable.bulkCreate(messages, { returning: true });
}

function updateMessage(messageId: string, message: any) {
  return MessagesTable.update(message, {
    where: { id: messageId }
  });
}

function addThread(thread: any) {
  return ThreadsTable.create(thread);
  // {
  //   paperId,
  //   description,
  //   messageId,
  //   viewMode: 0
  // }
}

function toggleHideMessage( messageId: string, state: boolean) {
  return MessagesTable.update({ hidden: state }, {
    where: { id: messageId }
  });
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
