import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RefreshCw } from 'lucide-react-native';

import { colors, spacing, typography, borderRadius } from '../../config/theme';
import { Card } from '../../components/Card';
import { RequestRepository } from '../../database/repositories/RequestRepository';
import { ReliefRequest } from '../../models/Request';

export const RequestsScreen = () => {
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

  const renderItem = ({ item }: { item: ReliefRequest }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RequestDetail', { id: item.id })}>
      <Card style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <Text style={styles.requestType}>{item.type}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        </View>
        <Text style={styles.requestTitle}>{item.title}</Text>
        <Text style={styles.requestDescription} numberOfLines={2}>
          {item.description || 'No description provided.'}
        </Text>
        <View style={styles.requestFooter}>
          <Text style={styles.requestStatus}>{item.status}</Text>
          <View style={styles.syncStatusContainer}>
            <RefreshCw size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.syncStatus}>{item.syncStatus}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No requests found.</Text>
          </View>
        )}
      />
    </View>
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
    marginBottom: spacing.xs,
  },
  requestDescription: {
    ...typography.bodySecondary,
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
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  }
});
