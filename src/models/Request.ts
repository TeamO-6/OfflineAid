export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RequestStatus = 'Open' | 'In Progress' | 'Fulfilled';

export type SyncStatus = 'PENDING' | 'SYNCED' | 'RECEIVED' | 'UPDATED' | 'CONFLICT';

export interface ReliefRequest {
  id: string;
  type: string;
  title: string;
  description?: string;
  quantity?: number;
  priority: PriorityLevel;
  latitude?: number;
  longitude?: number;
  status: RequestStatus;
  originDeviceId: string;
  createdAt: number;
  updatedAt: number;
  version: number;
  syncStatus: SyncStatus;
}
