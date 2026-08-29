export const CREATE_REQUESTS_TABLE = `
  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    quantity INTEGER,
    priority TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    status TEXT NOT NULL,
    originDeviceId TEXT NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    version INTEGER NOT NULL,
    syncStatus TEXT NOT NULL
  );
`;

export const CREATE_DEVICES_TABLE = `
  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    lastSeen INTEGER NOT NULL,
    lastSync INTEGER,
    requestsKnown INTEGER DEFAULT 0
  );
`;

export const CREATE_SYNC_EVENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS sync_events (
    id TEXT PRIMARY KEY,
    requestId TEXT,
    sourceDeviceId TEXT,
    destinationDeviceId TEXT,
    eventType TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    status TEXT NOT NULL
  );
`;
