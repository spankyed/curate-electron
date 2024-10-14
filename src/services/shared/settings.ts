import Store from 'electron-store';

export type Settings = {
  isNewUser: boolean;
  // autoScrapeNewDates: boolean;
  apiKeyOpenAI: string;
  // scrapeInterval: number;
  features: string[];
  seedReferencesIds: string[];
};

// const savePath = app.getPath('userData');
// console.log('savePath: ', savePath);

const store = new Store<Settings>({
  defaults: {
    isNewUser: true,
    // autoScrapeNewDates: true,
    apiKeyOpenAI: '',
    // scrapeInterval: 3,
    features: ['video_generator'],
    seedReferencesIds: [
      '2308.05481',
      '2307.09909',
      '2307.06159',
      '2307.05082',
      '2307.05300',
      '2305.10601',
      '2307.01933',
      '2307.01577',
      '2307.01548',
      '2307.01403',
      '2307.01204',
      '2307.02276',
      '2307.02046',
      '2307.02295',
      '2307.01928',
      '2307.02477',
      '2307.02485',
      '1801.07243v5',
      '2307.02390',
      '2307.07255',
      '2307.06917',
      '2307.08962',
      '2206.08853',
      '2307.09364',
      '2307.08859',
      '2307.09721',
      '2210.02441',
      '2307.10680',
      '2208.03299',
      '2308.13916',
      '2308.13724',
      '2308.14296',
      '2305.01157',
      '2404.05966',
      '2404.07439',
    ],
  },
});

export function getStore(): Settings {
  return store.store;
}

export function getSetting<K extends keyof Settings>(accessor: K): Settings[K] {
  return store.get(accessor);
}

export function setSetting<K extends keyof Settings>(
  accessor: K | Partial<Settings>,
  value?: Settings[K]
): void {
  if (typeof accessor === 'string') {
    store.set(accessor, value);
  } else {
    store.set(accessor);
  }
}

// setSetting('isNewUser', true);
