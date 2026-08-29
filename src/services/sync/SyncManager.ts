import { RequestRepository } from '../../database/repositories/RequestRepository';
import { wifiDirectTransport } from '../p2p/WifiDirectTransport';
import { PeerMessage } from '../p2p/PeerTransport';
import { ConflictResolver } from './ConflictResolver';
import { ReliefRequest } from '../../models/Request';

class SyncManager {
  private myDeviceId: string = 'Device-A'; // In reality, generated or fetched from storage

  constructor() {
    wifiDirectTransport.onMessage(this.handleIncomingMessage.bind(this));
    wifiDirectTransport.onPeerConnected(this.handlePeerConnected.bind(this));
  }

  public getMyDeviceId() {
    return this.myDeviceId;
  }

  public async syncWithPeer(peerId: string) {
    console.log(`[SyncManager] Starting sync with ${peerId}`);
    const pendingRequests = await RequestRepository.getPendingSync();
    
    if (pendingRequests.length > 0) {
      const payload = { requests: pendingRequests };
      const message: PeerMessage = {
        type: 'SYNC_REQUEST',
        payload,
        senderId: this.myDeviceId,
        timestamp: Date.now()
      };
      
      try {
        await wifiDirectTransport.sendMessage(peerId, message);
        
        // Optimistically mark as synced (in a real app, wait for ACK)
        for (const req of pendingRequests) {
          req.syncStatus = 'SYNCED';
          await RequestRepository.update(req);
        }
      } catch (err) {
        console.error(`[SyncManager] Failed to sync with ${peerId}:`, err);
      }
    }
  }

  private async handlePeerConnected(peerId: string) {
    // Automatically attempt to sync pending items when a peer connects
    await this.syncWithPeer(peerId);
  }

  private async handleIncomingMessage(message: PeerMessage) {
    if (message.type === 'SYNC_REQUEST' || message.type === 'NEW_REQUEST' || message.type === 'UPDATE_REQUEST') {
      const incomingRequests: ReliefRequest[] = message.payload.requests || [];
      
      for (const incoming of incomingRequests) {
        const local = await RequestRepository.getById(incoming.id);
        const resolved = ConflictResolver.mergeRequests(local, incoming);
        
        if (!local) {
          resolved.syncStatus = 'RECEIVED';
          await RequestRepository.create(resolved);
          console.log(`[SyncManager] Created new request from sync: ${resolved.id}`);
        } else if (resolved.version > local.version || (resolved.version === local.version && resolved.updatedAt > local.updatedAt)) {
          resolved.syncStatus = 'RECEIVED';
          await RequestRepository.update(resolved);
          console.log(`[SyncManager] Updated request from sync: ${resolved.id}`);
        } else if (resolved.version === local.version && local.syncStatus === 'CONFLICT') {
          // Auto resolved
          resolved.syncStatus = 'SYNCED';
          await RequestRepository.update(resolved);
          console.log(`[SyncManager] Resolved conflict for: ${resolved.id}`);
        }
      }
    }
  }
}

export const syncManager = new SyncManager();
