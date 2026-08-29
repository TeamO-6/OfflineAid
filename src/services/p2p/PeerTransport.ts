export interface PeerMessage {
  type: 'SYNC_REQUEST' | 'SYNC_RESPONSE' | 'NEW_REQUEST' | 'UPDATE_REQUEST';
  payload: any;
  senderId: string;
  timestamp: number;
}

export interface PeerTransport {
  start(): Promise<void>;
  stop(): Promise<void>;
  scanForPeers(): Promise<string[]>;
  connect(peerId: string): Promise<boolean>;
  disconnect(peerId: string): Promise<void>;
  sendMessage(peerId: string, message: PeerMessage): Promise<void>;
  onMessage(callback: (message: PeerMessage) => void): void;
  onPeerConnected(callback: (peerId: string) => void): void;
  onPeerDisconnected(callback: (peerId: string) => void): void;
}
