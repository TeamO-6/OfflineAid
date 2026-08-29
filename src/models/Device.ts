export interface Device {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSeen: number;
  lastSync?: number;
  requestsKnown: number;
}
