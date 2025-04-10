import { promises as fs } from 'node:fs';
import { DEFAULT_SETTINGS } from '../settings';
const jsonFilePath = '/Users/spankyed/Library/Application Support/curate-gpt/config.json';

export async function setIsNewUser() {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf8');

    const jsonData = JSON.parse(data);

    jsonData.isNewUser = true;

    await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');

    console.log('Successfully set "isNewUser" to true.');
  } catch (err) {
    console.error('Error:', err);
  }
}

export async function resetStore() {
  try {
    await fs.writeFile(jsonFilePath, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
    console.log('Successfully reset store to default settings.');
  } catch (err) {
    console.error('Error:', err);
  }
}
