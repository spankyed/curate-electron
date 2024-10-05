import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ! config cannot have trailing commas

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../../../../config.ts');

export type Config = {
  settings: {
    isNewUser?: boolean;
    lastDateChecked?: string;
    autoScrapeNewDates?: boolean;
    scrapeInterval?: number | string;
  },
  features?: string[];
  seedReferencesIds?: string[];
};

export async function getConfig(): Promise<Config> {
  const fileContents = await fs.readFile(configPath, 'utf8')

  const json = fileContents.replace('export default ', '').replace(';', '')
    .replace(`],\n}\n`, `]\n}\n`)

  let config: Config;

  try {
    config = JSON.parse(json);
  } catch (error) {
    throw new Error(`Error parsing config file, theres probably a trailing comma`);
  }

  return config
}
