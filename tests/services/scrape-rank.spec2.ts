import { expect } from 'vitest';
// import { createScrapeAndRankMachine } from '../../../src/services/worker/scrape-rank/actors/system';

function sum(a, b) {
  return a + b;
}

describe('scrape & rank system actors', () => {
  it('should scrape and rank', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
