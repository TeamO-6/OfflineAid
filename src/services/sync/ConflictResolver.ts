import { ReliefRequest } from '../../models/Request';

export class ConflictResolver {
  // Deterministic CRDT-inspired merge logic
  static mergeRequests(local: ReliefRequest | null, incoming: ReliefRequest): ReliefRequest {
    if (!local) {
      return incoming;
    }

    // If versions are different, higher version wins
    if (incoming.version > local.version) {
      return incoming;
    }
    
    if (incoming.version < local.version) {
      return local;
    }

    // If versions are same, tie-break using updated timestamp
    if (incoming.updatedAt > local.updatedAt) {
      return incoming;
    }

    if (incoming.updatedAt < local.updatedAt) {
      return local;
    }

    // Final deterministic tie-breaker: device ID string comparison
    if (incoming.originDeviceId > local.originDeviceId) {
      return incoming;
    }

    return local;
  }
}
