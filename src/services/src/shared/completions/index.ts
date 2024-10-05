import { ChatCompletionCreateParams, type ChatCompletionChunk } from 'openai/resources/chat/completions';
import { StreamHandlers, streamOpenAI, templates } from './openai';
import OpenAI from 'openai';

type Provider = 'openai' | 'anthropic';
const modelProviders: { [key: string]: Provider } = {
  ['gpt-4o']: 'openai',
  ['claude-3-sonnet-20240229']: 'anthropic',
}

function getProvider(model: keyof typeof modelProviders){
  return modelProviders[model] || undefined;
}

export async function createChatStream({
  model,
  pdf,
  messages,
  handlers,
}: {
  model: OpenAI.Chat.ChatModel,
  pdf: string,
  messages: ChatCompletionCreateParams['messages'],
  handlers: StreamHandlers,
}) {
  const provider = getProvider(model);

  if (!provider) {
    console.error(`Provider not found for model ${model}`);
    return;
  }

  if (provider === 'openai') {
    const paramsTemplate = templates.conversation(pdf, messages, model);

    return streamOpenAI({ ...paramsTemplate, model }, handlers)
  }
  // else if (provider === 'anthropic') {
  //   // todo if provider is anthropic,
  //   // ! the first message must be from the user
  //   // todo handle branches from assistant messages
  // }
}
