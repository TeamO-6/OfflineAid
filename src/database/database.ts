import * as SQLite from 'expo-sqlite';
import { CREATE_REQUESTS_TABLE, CREATE_DEVICES_TABLE, CREATE_SYNC_EVENTS_TABLE } from './schema';

const dbName = 'offlineaid.db';

export const getDb = async () => {
  return await SQLite.openDatabaseAsync(dbName);
};

export const initializeDatabase = async () => {
  const db = await getDb();
  try {
    await db.execAsync(CREATE_REQUESTS_TABLE);
    await db.execAsync(CREATE_DEVICES_TABLE);
    await db.execAsync(CREATE_SYNC_EVENTS_TABLE);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
