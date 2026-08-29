import { PeerMessage, PeerTransport } from './PeerTransport';

// A realistic simulation of a mesh network transport layer for Demo Mode
export class SimulatedPeerTransport implements PeerTransport {
  private isRunning = false;
  private connectedPeers: Set<string> = new Set();
  private availablePeers: string[] = ['Device-B', 'Device-C', 'Device-D'];
  
  private messageCallbacks: ((msg: PeerMessage) => void)[] = [];
  private connectCallbacks: ((id: string) => void)[] = [];
  private disconnectCallbacks: ((id: string) => void)[] = [];

  async start(): Promise<void> {
    this.isRunning = true;
    console.log('[P2P] Transport started');
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.connectedPeers.clear();
    console.log('[P2P] Transport stopped');
  }

  async scanForPeers(): Promise<string[]> {
    if (!this.isRunning) return [];
    // Simulate scanning delay
    await new Promise(r => setTimeout(r, 1500));
    return this.availablePeers.filter(p => !this.connectedPeers.has(p));
  }

  async connect(peerId: string): Promise<boolean> {
    if (!this.isRunning) return false;
    await new Promise(r => setTimeout(r, 800));
    this.connectedPeers.add(peerId);
    this.connectCallbacks.forEach(cb => cb(peerId));
    return true;
  }

  async disconnect(peerId: string): Promise<void> {
    this.connectedPeers.delete(peerId);
    this.disconnectCallbacks.forEach(cb => cb(peerId));
  }

  async sendMessage(peerId: string, message: PeerMessage): Promise<void> {
    if (!this.connectedPeers.has(peerId)) {
      throw new Error('Peer not connected');
    }
    console.log(`[P2P] Sending message to ${peerId}:`, message.type);
    // In simulation, we just log it unless we build a full multi-device simulation env.
    // In a real app, this sends over Bluetooth/WiFi-Direct.
  }

  // Methods to simulate receiving data from the outside world (Demo Mode controls)
  simulateIncomingMessage(message: PeerMessage) {
    this.messageCallbacks.forEach(cb => cb(message));
  }

  onMessage(callback: (message: PeerMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  onPeerConnected(callback: (peerId: string) => void): void {
    this.connectCallbacks.push(callback);
  }

  onPeerDisconnected(callback: (peerId: string) => void): void {
    this.disconnectCallbacks.push(callback);
  }
}

export const simulatedTransport = new SimulatedPeerTransport();
