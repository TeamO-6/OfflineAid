import { getDb } from '../database';
import { ReliefRequest } from '../../models/Request';

export class RequestRepository {
  static async create(request: ReliefRequest): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO requests (id, type, title, description, quantity, priority, latitude, longitude, status, originDeviceId, createdAt, updatedAt, version, syncStatus)
       VALUES ($id, $type, $title, $description, $quantity, $priority, $latitude, $longitude, $status, $originDeviceId, $createdAt, $updatedAt, $version, $syncStatus)`,
      {
        $id: request.id,
        $type: request.type,
        $title: request.title,
        $description: request.description || null,
        $quantity: request.quantity || null,
        $priority: request.priority,
        $latitude: request.latitude || null,
        $longitude: request.longitude || null,
        $status: request.status,
        $originDeviceId: request.originDeviceId,
        $createdAt: request.createdAt,
        $updatedAt: request.updatedAt,
        $version: request.version,
        $syncStatus: request.syncStatus
      }
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
       SET type = $type, title = $title, description = $description, quantity = $quantity, priority = $priority, 
           latitude = $latitude, longitude = $longitude, status = $status, updatedAt = $updatedAt, version = $version, syncStatus = $syncStatus
       WHERE id = $id`,
      {
        $type: request.type,
        $title: request.title,
        $description: request.description || null,
        $quantity: request.quantity || null,
        $priority: request.priority,
        $latitude: request.latitude || null,
        $longitude: request.longitude || null,
        $status: request.status,
        $updatedAt: request.updatedAt,
        $version: request.version,
        $syncStatus: request.syncStatus,
        $id: request.id
      }
    );
  }

  static async getPendingSync(): Promise<ReliefRequest[]> {
    const db = await getDb();
    return await db.getAllAsync<ReliefRequest>(
      'SELECT * FROM requests WHERE syncStatus = $s1 OR syncStatus = $s2',
      { $s1: 'PENDING', $s2: 'UPDATED' }
    );
  }
}
