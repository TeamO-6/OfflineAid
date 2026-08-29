import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Smartphone, Network, DownloadCloud, Activity } from 'lucide-react-native';

import { colors, spacing, typography, borderRadius } from '../../config/theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PermissionsAndroid, Platform } from 'react-native';
import { wifiDirectTransport } from '../../services/p2p/WifiDirectTransport';
import { syncManager } from '../../services/sync/SyncManager';

export const MeshNetworkScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [availablePeers, setAvailablePeers] = useState<string[]>([]);
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // NEARBY_WIFI_DEVICES is Android 13+, so we might need to handle it gracefully
        PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES || 'android.permission.NEARBY_WIFI_DEVICES'
      ]);
    }
  };

  const handleScan = async () => {
    await requestPermissions();
    setIsScanning(true);
    const peers = await wifiDirectTransport.scanForPeers();
    setAvailablePeers(peers);
    setIsScanning(false);
  };

  const handleConnect = async (peerId: string) => {
    const success = await wifiDirectTransport.connect(peerId);
    if (success) {
      setAvailablePeers(prev => prev.filter(p => p !== peerId));
      setConnectedPeers(prev => [...prev, peerId]);
    } else {
      Alert.alert('Connection Failed', 'Could not establish Wi-Fi Direct connection.');
    }
  };

  const handleDisconnect = async (peerId: string) => {
    await wifiDirectTransport.disconnect(peerId);
    setConnectedPeers(prev => prev.filter(p => p !== peerId));
    setAvailablePeers(prev => [...prev, peerId]);
  };

  const handleManualSync = async () => {
    if (connectedPeers.length === 0) {
      Alert.alert('No peers', 'Connect to a device first.');
      return;
    }
    for (const peer of connectedPeers) {
      await syncManager.syncWithPeer(peer);
    }
    Alert.alert('Sync Initiated', 'Sending local changes to connected peers.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Mesh Visualization */}
      <View style={styles.visualization}>
        <Network size={64} color={colors.primary} style={{ opacity: 0.2, position: 'absolute' }} />
        <View style={styles.myDevice}>
          <Smartphone size={32} color={colors.surface} />
          <Text style={styles.myDeviceText}>My Device</Text>
          <Text style={styles.myDeviceId}>{syncManager.getMyDeviceId()}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Button 
          title={isScanning ? "Scanning..." : "Scan for Devices"} 
          onPress={handleScan}
          style={{ flex: 1, marginRight: 8 }}
          variant="secondary"
        />
        <Button 
          title="Sync Now" 
          onPress={handleManualSync}
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      {/* Connected Peers */}
      <Text style={styles.sectionTitle}>Connected Devices ({connectedPeers.length})</Text>
      {connectedPeers.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No devices currently connected.</Text>
        </Card>
      ) : (
        connectedPeers.map(peer => (
          <Card key={peer} style={styles.peerCard}>
            <View style={styles.peerInfo}>
              <Smartphone size={24} color={colors.primary} />
              <View style={styles.peerDetails}>
                <Text style={styles.peerName}>{peer}</Text>
                <Text style={styles.peerStatus}>Connected • Ready to sync</Text>
              </View>
            </View>
            <Button 
              title="Disconnect" 
              variant="outline" 
              onPress={() => handleDisconnect(peer)} 
              style={styles.disconnectBtn}
              textStyle={{ fontSize: 12 }}
            />
          </Card>
        ))
      )}

      {/* Available Peers */}
      {availablePeers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Available Nearby ({availablePeers.length})</Text>
          {availablePeers.map(peer => (
            <Card key={peer} style={styles.peerCard}>
              <View style={styles.peerInfo}>
                <Smartphone size={24} color={colors.textSecondary} />
                <View style={styles.peerDetails}>
                  <Text style={styles.peerName}>{peer}</Text>
                  <Text style={styles.peerStatus}>Tap to connect</Text>
                </View>
              </View>
              <Button 
                title="Connect" 
                variant="primary" 
                onPress={() => handleConnect(peer)} 
                style={styles.connectBtn}
                textStyle={{ fontSize: 12 }}
              />
            </Card>
          ))}
        </>
      )}

      {/* Demo Tools */}
      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>Live P2P Mode</Text>
        <Text style={styles.demoDesc}>Wi-Fi Direct handles device-to-device connections. Ensure both devices have Wi-Fi turned on and are disconnected from any hotspot.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.m,
  },
  visualization: {
    height: 180,
    backgroundColor: '#fff',
    borderRadius: borderRadius.l,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.l,
    ...typography.h3,
  },
  myDevice: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: borderRadius.round,
    width: 120,
    height: 120,
    justifyContent: 'center',
  },
  myDeviceText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  myDeviceId: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: spacing.l,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.m,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.l,
    marginBottom: spacing.l,
  },
  emptyText: {
    ...typography.bodySecondary,
  },
  peerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  peerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  peerDetails: {
    marginLeft: spacing.m,
  },
  peerName: {
    ...typography.body,
    fontWeight: 'bold',
  },
  peerStatus: {
    ...typography.caption,
  },
  disconnectBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
  },
  connectBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
  },
  demoSection: {
    marginTop: spacing.xxl,
    paddingTop: spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoTitle: {
    ...typography.h3,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  demoDesc: {
    ...typography.caption,
    marginBottom: spacing.m,
  }
});
