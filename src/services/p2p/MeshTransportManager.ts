import { PeerMessage, PeerTransport } from './PeerTransport';
import { wifiDirectTransport } from './WifiDirectTransport';
import { BluetoothTransport } from './BluetoothTransport';

export class MeshTransportManager implements PeerTransport {
  private btTransport = new BluetoothTransport();
  private messageCallbacks: ((msg: PeerMessage) => void)[] = [];
  private connectCallbacks: ((id: string) => void)[] = [];
  private disconnectCallbacks: ((id: string) => void)[] = [];

  constructor() {
    // Forward events from Wi-Fi Direct
    wifiDirectTransport.onMessage(msg => this.messageCallbacks.forEach(cb => cb(msg)));
    wifiDirectTransport.onPeerConnected(id => this.connectCallbacks.forEach(cb => cb(id)));
    wifiDirectTransport.onPeerDisconnected(id => this.disconnectCallbacks.forEach(cb => cb(id)));

    // Forward events from Bluetooth
    this.btTransport.onMessage(msg => this.messageCallbacks.forEach(cb => cb(msg)));
    this.btTransport.onPeerConnected(id => this.connectCallbacks.forEach(cb => cb(id)));
    this.btTransport.onPeerDisconnected(id => this.disconnectCallbacks.forEach(cb => cb(id)));
  }

  async start(): Promise<void> {
    await Promise.all([
      wifiDirectTransport.start(),
      this.btTransport.start(),
    ]);
    console.log('[MeshTransport] Both Wi-Fi Direct and Bluetooth started.');
  }

  async stop(): Promise<void> {
    await Promise.all([
      wifiDirectTransport.stop(),
      this.btTransport.stop(),
    ]);
    console.log('[MeshTransport] Both transports stopped.');
  }

  async scanForPeers(): Promise<string[]> {
    // Scan concurrently on both interfaces
    const [wifiPeers, btPeers] = await Promise.all([
      wifiDirectTransport.scanForPeers(),
      this.btTransport.scanForPeers(),
    ]);
    
    return [...wifiPeers, ...btPeers];
  }

  async connect(peerId: string): Promise<boolean> {
    if (peerId.startsWith('BT:')) {
      return await this.btTransport.connect(peerId);
    } else {
      return await wifiDirectTransport.connect(peerId);
    }
  }

  async disconnect(peerId: string): Promise<void> {
    if (peerId.startsWith('BT:')) {
      await this.btTransport.disconnect(peerId);
    } else {
      await wifiDirectTransport.disconnect(peerId);
    }
  }

  async sendMessage(peerId: string, message: PeerMessage): Promise<void> {
    if (peerId.startsWith('BT:')) {
      await this.btTransport.sendMessage(peerId, message);
    } else {
      await wifiDirectTransport.sendMessage(peerId, message);
    }
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

export const meshTransportManager = new MeshTransportManager();
