import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
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

  useEffect(() => {
    const loadRequests = async () => {
      const data = await RequestRepository.getAll();
      // Filter requests that have coordinates (in a real app, use device location)
      setRequests(data.filter(r => true)); // Currently mapping all, will randomize for demo
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
  }
});
