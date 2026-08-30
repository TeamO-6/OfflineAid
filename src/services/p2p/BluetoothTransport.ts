import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import { PeerMessage, PeerTransport } from './PeerTransport';
import { Platform } from 'react-native';

export class BluetoothTransport implements PeerTransport {
  private isRunning = false;
  private messageCallbacks: ((msg: PeerMessage) => void)[] = [];
  private connectCallbacks: ((id: string) => void)[] = [];
  private disconnectCallbacks: ((id: string) => void)[] = [];

  private connectedDevices: Map<string, BluetoothDevice> = new Map();
  private deviceListeners: any[] = [];

  async start(): Promise<void> {
    if (Platform.OS !== 'android') return;
    try {
      const available = await RNBluetoothClassic.isBluetoothAvailable();
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (available && enabled) {
        this.isRunning = true;
        console.log('[Bluetooth] Transport started');
      }
    } catch (e) {
      console.error('[Bluetooth] Init failed:', e);
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.deviceListeners.forEach(listener => listener.remove());
    this.deviceListeners = [];
    
    for (const [id, device] of this.connectedDevices.entries()) {
      try {
        await device.disconnect();
      } catch (e) {}
    }
    this.connectedDevices.clear();
    console.log('[Bluetooth] Transport stopped');
  }

  async scanForPeers(): Promise<string[]> {
    if (!this.isRunning) return [];
    try {
      const unpaired = await RNBluetoothClassic.startDiscovery();
      const paired = await RNBluetoothClassic.getBondedDevices();
      const allDevices = [...paired, ...unpaired];
      
      // Return unique addresses
      const addresses = Array.from(new Set(allDevices.map(d => d.address)));
      return addresses.map(addr => `BT:${addr}`);
    } catch (e) {
      console.error('[Bluetooth] Scan failed:', e);
      return [];
    }
  }

  async connect(peerId: string): Promise<boolean> {
    if (!this.isRunning) return false;
    const address = peerId.replace('BT:', '');
    try {
      const device = await RNBluetoothClassic.connectToDevice(address);
      if (device) {
        this.connectedDevices.set(peerId, device);
        this.connectCallbacks.forEach(cb => cb(peerId));

        // Setup message listener for this device
        const listener = device.onDataReceived((data) => {
          try {
            const msg: PeerMessage = JSON.parse(data.data);
            this.messageCallbacks.forEach(cb => cb(msg));
          } catch (e) {
            console.error('[Bluetooth] Failed to parse message', e);
          }
        });
        this.deviceListeners.push(listener);
        
        return true;
      }
      return false;
    } catch (e) {
      console.error(`[Bluetooth] Connect failed to ${peerId}:`, e);
      return false;
    }
  }

  async disconnect(peerId: string): Promise<void> {
    const device = this.connectedDevices.get(peerId);
    if (device) {
      await device.disconnect();
      this.connectedDevices.delete(peerId);
      this.disconnectCallbacks.forEach(cb => cb(peerId));
    }
  }

  async sendMessage(peerId: string, message: PeerMessage): Promise<void> {
    const device = this.connectedDevices.get(peerId);
    if (device) {
      await device.write(JSON.stringify(message) + '\n');
    } else {
      throw new Error(`Device ${peerId} not connected via Bluetooth`);
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
