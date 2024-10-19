import { getSequelize } from '../schema-manual';
import { promises as fs } from 'node:fs';

export async function synchronizeDatabase() {
  try {
    const sequelize = getSequelize();
    await sequelize.sync({ force: true }); // Use force: true with caution, it will drop tables before recreating them
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Failed to synchronize database:', error);
  }
}

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
