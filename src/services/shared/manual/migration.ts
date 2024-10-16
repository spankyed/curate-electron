import { sequelize } from '../schema';
import { setSetting } from '../settings';

export async function synchronizeDatabase() {
  try {
    await sequelize.sync({ force: true }); // Use force: true with caution, it will drop tables before recreating them
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Failed to synchronize database:', error);
  }
}

synchronizeDatabase();

setSetting('isNewUser', true);
