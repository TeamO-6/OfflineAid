import { PermissionsAndroid, Platform } from 'react-native';
import {
  initialize,
  startDiscoveringPeers,
  getAvailablePeers,
  connect,
  cancelConnect,
  sendMessage,
  receiveMessage,
  subscribeOnPeersUpdates,
  subscribeOnConnectionInfoUpdates
} from 'react-native-wifi-p2p';
import { PeerMessage, PeerTransport } from './PeerTransport';

export class WifiDirectTransport implements PeerTransport {
  private isRunning = false;
  private messageCallbacks: ((msg: PeerMessage) => void)[] = [];
  private connectCallbacks: ((id: string) => void)[] = [];
  private disconnectCallbacks: ((id: string) => void)[] = [];

  private peersSubscription: any;
  private connectionSubscription: any;
  private pollInterval: any;

  async start(): Promise<void> {
    if (Platform.OS !== 'android') {
      console.warn('Wi-Fi Direct is only supported on Android.');
      return;
    }

    try {
      await initialize();
      this.isRunning = true;

      // Setup listeners
      this.peersSubscription = subscribeOnPeersUpdates(({ devices }) => {
        console.log('[Wi-Fi Direct] Peers updated:', devices);
      });

      this.connectionSubscription = subscribeOnConnectionInfoUpdates((info) => {
        console.log('[Wi-Fi Direct] Connection info:', info);
        // We trigger connect callback if we get connected.
        // Note: react-native-wifi-p2p is low level, so we just assume the group owner or connected client.
        if (info.groupFormed) {
          this.connectCallbacks.forEach(cb => cb('Connected-Peer'));
        }
      });

      console.log('[Wi-Fi Direct] Transport started');

      // Start long-polling for incoming messages (P2P library constraint)
      this.pollInterval = setInterval(async () => {
        try {
          const rawMsg = await receiveMessage();
          if (rawMsg) {
            const msg: PeerMessage = JSON.parse(rawMsg);
            this.messageCallbacks.forEach(cb => cb(msg));
          }
        } catch (e) {
          // Ignore timeout or empty read errors
        }
      }, 2000);

    } catch (e) {
      console.error('[Wi-Fi Direct] Initialization failed:', e);
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.peersSubscription) this.peersSubscription.remove();
    if (this.connectionSubscription) this.connectionSubscription.remove();
    if (this.pollInterval) clearInterval(this.pollInterval);
    await cancelConnect();
    console.log('[Wi-Fi Direct] Transport stopped');
  }

  async scanForPeers(): Promise<string[]> {
    if (!this.isRunning || Platform.OS !== 'android') return [];

    try {
      await startDiscoveringPeers();
      // Give it a moment to discover
      await new Promise(r => setTimeout(r, 2000));
      
      const response = await getAvailablePeers();
      const peers = response?.devices || [];
      return peers.map((p: any) => p.deviceAddress);
    } catch (e) {
      console.error('[Wi-Fi Direct] Scan failed:', e);
      return [];
    }
  }

  async connect(peerId: string): Promise<boolean> {
    if (!this.isRunning || Platform.OS !== 'android') return false;
    try {
      console.log(`[Wi-Fi Direct] Connecting to ${peerId}...`);
      await connect(peerId);
      this.connectCallbacks.forEach(cb => cb(peerId));
      return true;
    } catch (e) {
      console.error(`[Wi-Fi Direct] Connection to ${peerId} failed:`, e);
      return false;
    }
  }

  async disconnect(peerId: string): Promise<void> {
    if (!this.isRunning || Platform.OS !== 'android') return;
    try {
      await cancelConnect();
      this.disconnectCallbacks.forEach(cb => cb(peerId));
    } catch (e) {
      console.error('[Wi-Fi Direct] Disconnect failed:', e);
    }
  }

  async sendMessage(peerId: string, message: PeerMessage): Promise<void> {
    if (!this.isRunning || Platform.OS !== 'android') return;
    try {
      const rawMsg = JSON.stringify(message);
      await sendMessage(rawMsg);
      console.log(`[Wi-Fi Direct] Sent message to ${peerId}`);
    } catch (e) {
      console.error('[Wi-Fi Direct] Send message failed:', e);
      throw e;
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

export const wifiDirectTransport = new WifiDirectTransport();
