import { getDb } from '../database';
import { ReliefRequest } from '../../models/Request';

export class RequestRepository {
  static async create(request: ReliefRequest): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO requests (id, type, title, description, quantity, priority, latitude, longitude, status, originDeviceId, createdAt, updatedAt, version, syncStatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      request.id,
      request.type,
      request.title,
      request.description || null,
      request.quantity || null,
      request.priority,
      request.latitude || null,
      request.longitude || null,
      request.status,
      request.originDeviceId,
      request.createdAt,
      request.updatedAt,
      request.version,
      request.syncStatus
    );
  }

  static async getAll(): Promise<ReliefRequest[]> {
    const db = await getDb();
    return await db.getAllAsync<ReliefRequest>('SELECT * FROM requests ORDER BY createdAt DESC');
  }

  static async getById(id: string): Promise<ReliefRequest | null> {
    const db = await getDb();
    return await db.getFirstAsync<ReliefRequest>('SELECT * FROM requests WHERE id = ?', [id]);
  }

  static async update(request: ReliefRequest): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `UPDATE requests 
       SET type = ?, title = ?, description = ?, quantity = ?, priority = ?, 
           latitude = ?, longitude = ?, status = ?, updatedAt = ?, version = ?, syncStatus = ?
       WHERE id = ?`,
      request.type,
      request.title,
      request.description || null,
      request.quantity || null,
      request.priority,
      request.latitude || null,
      request.longitude || null,
      request.status,
      request.updatedAt,
      request.version,
      request.syncStatus,
      request.id
    );
  }

  static async getPendingSync(): Promise<ReliefRequest[]> {
    const db = await getDb();
    return await db.getAllAsync<ReliefRequest>(
      'SELECT * FROM requests WHERE syncStatus = ? OR syncStatus = ?',
      'PENDING', 'UPDATED'
    );
  }
}
