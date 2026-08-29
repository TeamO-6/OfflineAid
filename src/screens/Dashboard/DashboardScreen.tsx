import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Network, AlertCircle, RefreshCw } from 'lucide-react-native';

import { colors, spacing, typography, borderRadius } from '../../config/theme';
import { APP_CONFIG } from '../../config/appConfig';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { RequestRepository } from '../../database/repositories/RequestRepository';
import { ReliefRequest } from '../../models/Request';

export const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const [requests, setRequests] = useState<ReliefRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    const data = await RequestRepository.getAll();
    setRequests(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadRequests();
    });
    loadRequests();
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const pendingCount = requests.filter(r => r.syncStatus === 'PENDING').length;
  const syncedCount = requests.filter(r => r.syncStatus === 'SYNCED' || r.syncStatus === 'RECEIVED').length;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Mesh Network Status */}
      <Card style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Network color={colors.primary} size={24} />
          <Text style={styles.statusTitle}>Mesh Network Active</Text>
        </View>
        <Text style={styles.statusSubtitle}>● Offline Mode</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Nearby Devices</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{syncedCount}</Text>
            <Text style={styles.statLabel}>Synchronized</Text>
          </View>
        </View>
      </Card>

      {/* Create Request Action */}
      <Button 
        title="Create Emergency Request"
        onPress={() => navigation.navigate('CreateRequest')}
        style={styles.createButton}
      />

      {/* Recent Requests Summary */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Requests</Text>
      </View>
      
      {requests.length === 0 ? (
        <View style={styles.emptyState}>
          <AlertCircle color={colors.textSecondary} size={48} />
          <Text style={styles.emptyText}>No requests recorded yet.</Text>
          <Text style={styles.emptySubtext}>Create a request to broadcast to nearby devices.</Text>
        </View>
      ) : (
        requests.slice(0, 5).map(req => (
          <Card key={req.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestType}>{req.type}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(req.priority) }]}>
                <Text style={styles.priorityText}>{req.priority}</Text>
              </View>
            </View>
            <Text style={styles.requestTitle}>{req.title}</Text>
            <View style={styles.requestFooter}>
              <Text style={styles.requestStatus}>{req.status}</Text>
              <View style={styles.syncStatusContainer}>
                <RefreshCw size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.syncStatus}>{req.syncStatus}</Text>
              </View>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const getPriorityColor = (priority: string) => {
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
  content: {
    padding: spacing.m,
  },
  statusCard: {
    backgroundColor: '#fff',
    marginBottom: spacing.l,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statusTitle: {
    ...typography.h3,
    marginLeft: spacing.s,
  },
  statusSubtitle: {
    ...typography.bodySecondary,
    color: colors.error,
    marginBottom: spacing.m,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: 4,
  },
  createButton: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    marginBottom: spacing.m,
  },
  sectionTitle: {
    ...typography.h2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    opacity: 0.7,
  },
  emptyText: {
    ...typography.body,
    fontWeight: 'bold',
    marginTop: spacing.m,
  },
  emptySubtext: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  requestCard: {
    marginBottom: spacing.m,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  requestType: {
    ...typography.caption,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.s,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  requestTitle: {
    ...typography.h3,
    marginBottom: spacing.m,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestStatus: {
    ...typography.caption,
    fontWeight: '600',
  },
  syncStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncStatus: {
    ...typography.caption,
  },
});
