import type {
  ChatCompletionCreateParams,
  ChatCompletionChunk,
} from 'openai/resources/chat/completions';
import OpenAI from 'openai';
import { pdfText } from './prompts';
import { getSetting } from '../settings';

export type StreamHandlers = {
  onError?: () => void;
  onChunk: (contentDelta: string, contentSnapshot: string) => void;
  onCompletion: (completion: OpenAI.Chat.Completions.ChatCompletion) => void;
};

let openai: null | OpenAI = null;

export const templates = {
  conversation(
    pdf: string,
    rawConversation: ChatCompletionCreateParams['messages'],
    model: OpenAI.Chat.ChatModel
  ): Pick<ChatCompletionCreateParams, 'model' | 'messages'> {
    return {
      model,
      messages: [{ role: 'system', content: pdfText(pdf) }, ...rawConversation],
      // top_p: 0.5,
    };
  },
};

export async function streamOpenAI(
  template: Pick<ChatCompletionCreateParams, 'model' | 'messages'>,
  handlers: StreamHandlers
) {
  openai = new OpenAI({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: getSetting('apiKeyOpenAI'),
  });

  const stream = await openai.beta.chat.completions.stream({
    ...template,
    n: 1,
    stream: true,
    // stream_options: { include_usage: true },
  });

  stream.on('content', handlers.onChunk);
  stream.on('chatCompletion', handlers.onCompletion);
  // stream.on('error', handlers.onError)
  // stream.on('end', handlers.onCompletion)

  return stream;
}

export async function updateAPIKeyOpenAI(apiKey) {
  openai = new OpenAI({ apiKey });
}

export async function checkOpenAIKey(apiKey) {
  const testInstance = new OpenAI({ apiKey });

  try {
    await testInstance.models.list();
    return true;
  } catch (error) {
    console.error('error: ', error);
    return false;
  }
}
