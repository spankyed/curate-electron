import * as repository from './repository';
// import getPdfText from './scripts/get-pdf-text';
import initializeChat from './scripts/initialize-chat';
import startChatStream from './scripts/start-chat-stream';
import type { ChatCompletionStream } from 'openai/resources/beta/chat/completions';

async function initChat(paperId){
  try {
    const textLength = await initializeChat(paperId);
    const pdfTokenCount = textLength / 4;
  
    return pdfTokenCount;
  } catch (error) {
    console.error('Failed to initialize chat: ', error);
    return { error: 'Failed to initialize chat'};
  }
}

async function getMessages(threadId) {
  const messages = await repository.getMessages({ threadId, includeHidden: true });
  // const messages = await repository.getMessages(paperId, selectedThread);

  return messages;
}

async function getThreads(paperId){
  let threads = await repository.getAllThreads(paperId);
  
  let thread: any;

  if (!threads.length) {
    thread = await repository.addThread({
      paperId,
      description: 'Main thread',
      viewMode: 0,
    });

    threads = [thread];
  }


  setTimeout(() => {
    initializeChat(paperId);
  }, 10);

  return threads;
}

// async function setDocumentViewMode(request: any, h: any) {
//   // todo update thread record with new view mode
// }

async function createThread({ paperId, description }) {
  const newThread = await repository.addThread({
    paperId,
    description,
    viewMode: 0,
  });

  return newThread;
}

async function branchThread({ paperId, parentThreadId, messageId, description }) {
  const duplicateThreadDescriptions = await repository.findDuplicateDescriptions(paperId, description);
  const newDescription = description;
  const duplicateNumber = duplicateThreadDescriptions?.length ? duplicateThreadDescriptions?.length + 1 : null;

  const newThread = await repository.addThread({
    paperId,
    duplicateNumber,
    description: newDescription,
    messageId,
  });

  const [messages, parentMessage] = await Promise.all([
    repository.getMessages({ threadId: parentThreadId, messageId, includeHidden: false }),
    repository.getSingleMessage(messageId),
  ]);

  if (parentMessage) {
    messages.push(parentMessage);
  }

  const messageCopies = messages.map((message) => ({
    parentId: message.id === messageId ? message.id : null,
    threadId: newThread.id,
    text: message.text,
    role: message.role,
    hidden: false,
  }));

  const newMessages = await repository.addMessagesBulk(messageCopies);

  return {
    thread: newThread,
    messages: newMessages,
  };
}

async function toggleHideMessage({ messageId, state }) {
  await repository.toggleHideMessage(messageId, state);

  return '';
}

async function deleteMessage(messageId) {
  await repository.deleteMessage(messageId);

  return '';
}

async function sendMessage({ paperId, threadId, text }) {
  console.log('message received');

  const thread = await repository.getThread(threadId);

  if (!thread) {
    return { error: 'Thread not found', code: 404 };
  }

  const messageRecord = await repository.addMessage({
    paperId,
    threadId,
    text,
    hidden: false,
    role: 'user',
  });

  return messageRecord.id;
}

const threadStreams: { [key: string]: {
  stream: Promise<ChatCompletionStream | undefined>,
  messageId: string,
} } = {};

async function streamResponse({ paperId, threadId }) {
  console.log('paperId: ', paperId);
  console.log('streaming response');

  const thread = await repository.getThread(threadId);

  if (!thread) {
    return { error: 'Thread not found', code: 404 };
  }

  const model = 'gpt-4o';

  const [responseMessageId, stream] = await startChatStream({
    paperId,
    thread,
    model,
  })

  threadStreams[threadId] = {
    stream,
    messageId: responseMessageId,
  };

  return responseMessageId;
}

async function stopMessageStream({ threadId }) {
  const threadStream = threadStreams[threadId];

  if (threadStream) {
    const { stream, messageId } = threadStream;
    stream.then(async s => {
      s?.controller.abort();

      await repository.updateMessage(messageId, {
        status: 2,
      });

      // delete threadStreams[threadId]; // todo remove threadStreams on abort/completion
    });
  }

  return '';
}

async function regenerateResponse({ paperId, threadId, messageId }) {
  const thread = await repository.getThread(threadId);

  if (!thread) {
    return { error: 'Thread not found', code: 404 };
  }

  const model = 'gpt-4o';

  const [responseMessageId, stream] = await startChatStream({
    paperId,
    thread,
    model,
    messageId,
  })

  threadStreams[threadId] = {
    stream,
    messageId: responseMessageId,
  };

  return responseMessageId;
}

export default {
  'initialize-chat': initChat,
  'get-threads': getThreads,
  'get-messages': getMessages,
  // 'set-document-view-mode': setDocumentViewMode,
  'create-thread': createThread,
  'branch-thread': branchThread,
  'toggle-hide-message': toggleHideMessage,
  'delete-message': deleteMessage,
  'send-message': sendMessage,
  'stream-response': streamResponse,
  'stop-message-stream': stopMessageStream,
  'regenerate-response': regenerateResponse,
}
