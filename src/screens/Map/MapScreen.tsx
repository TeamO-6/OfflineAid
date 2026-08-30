import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Network from 'expo-network';
import { WifiOff, Map as MapIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { RequestRepository } from '../../database/repositories/RequestRepository';
import { ReliefRequest } from '../../models/Request';
import { colors } from '../../config/theme';

// Default to an arbitrary central location for the hackathon demo if no coordinates exist
const DEFAULT_REGION = {
  latitude: 28.6139,
  longitude: 77.2090,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const MapScreen = () => {
  const navigation = useNavigation<any>();
  const [requests, setRequests] = useState<ReliefRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      const data = await RequestRepository.getAll();
      const networkState = await Network.getNetworkStateAsync();
      
      if (!networkState.isConnected || !networkState.isInternetReachable) {
        // In a true offline environment without pre-downloaded tiles, OpenStreetMap will be a black screen.
        setIsOffline(true);
      } else {
        setIsOffline(false);
      }

      setRequests(data.filter(r => true));
      setLoading(false);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadRequests();
    });
    
    loadRequests();
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isOffline) {
    return (
      <View style={[styles.container, styles.center, { padding: 20 }]}>
        <WifiOff size={64} color={colors.textSecondary} style={{ marginBottom: 20 }} />
        <Text style={styles.offlineTitle}>Offline Mode</Text>
        <Text style={styles.offlineDesc}>
          Map tiles cannot be downloaded without an internet connection.
        </Text>
        <View style={styles.requestsFallback}>
          <MapIcon size={24} color={colors.primary} />
          <Text style={styles.fallbackText}>
            {requests.length} Relief Requests are available offline via the List view.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={true}
        mapType="none"
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {requests.map((req, index) => {
          // Generate deterministic fake coordinates around default region for demo purposes
          // In a real app, this would use req.latitude and req.longitude
          const lat = req.latitude || (DEFAULT_REGION.latitude + (Math.sin(index) * 0.02));
          const lng = req.longitude || (DEFAULT_REGION.longitude + (Math.cos(index) * 0.02));
          
          return (
            <Marker
              key={req.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={req.title}
              description={`${req.type} - ${req.priority} Priority`}
              pinColor={getPinColor(req.priority)}
              onCalloutPress={() => navigation.navigate('RequestDetail', { id: req.id })}
            />
          );
        })}
      </MapView>
    </View>
  );
};

const getPinColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return colors.priorityCritical;
    case 'High': return colors.priorityHigh;
    case 'Medium': return colors.priorityMedium;
    case 'Low': return colors.priorityLow;
    default: return colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  offlineDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  requestsFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,102,204,0.1)',
    padding: 16,
    borderRadius: 8,
  },
  fallbackText: {
    marginLeft: 12,
    color: colors.primary,
    fontWeight: '600',
  }
});
