import type { PaperRecord } from '@services/shared/types';

export const mockPaperRecords = [
  {
    id: '2301.04567',
    date: '2025-01-15',
    title: 'Transformers in Reinforcement Learning',
    abstract: 'Exploring transformers for policy and value estimation in RL tasks.',
    // relevancy: 0.87,
    status: 0,
  },
  {
    id: '2305.06789',
    date: '2025-01-15',
    title: 'Zero-Shot Learning with Large Language Models',
    abstract: "A study on LLMs' ability to perform zero-shot classification and reasoning.",
    // relevancy: 0.92,
    status: 0,
  },
  {
    id: '2310.02345',
    date: '2025-01-15',
    title: 'Efficient Fine-Tuning for Domain-Specific Tasks',
    abstract: 'Proposing parameter-efficient fine-tuning techniques for domain adaptation.',
    // relevancy: 0.78,
    status: 0,
  },
  {
    id: '2312.05678',
    date: '2025-01-15',
    title: 'AI for Game Physics Simulations',
    abstract: 'Leveraging AI models to enhance real-time physics in gaming applications.',
    // relevancy: 0.83,
    status: 0,
  },
] as PaperRecord[];
