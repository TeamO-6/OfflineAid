import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Clock, MapPin, Activity } from 'lucide-react-native';

import { colors, spacing, typography, borderRadius } from '../../config/theme';
import { Card } from '../../components/Card';
import { RequestRepository } from '../../database/repositories/RequestRepository';
import { ReliefRequest } from '../../models/Request';
import { Button } from '../../components/Button';
import { format } from 'date-fns';

export const RequestDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;
  
  const [request, setRequest] = useState<ReliefRequest | null>(null);

  const loadRequest = async () => {
    const data = await RequestRepository.getById(id);
    setRequest(data);
  };

  useEffect(() => {
    loadRequest();
  }, [id]);

  if (!request) return null;

  const handleUpdateStatus = async (status: 'Open' | 'In Progress' | 'Fulfilled') => {
    const updated = { 
      ...request, 
      status, 
      updatedAt: Date.now(), 
      version: request.version + 1, 
      syncStatus: 'UPDATED' as const 
    };
    await RequestRepository.update(updated);
    setRequest(updated);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.type}>{request.type}</Text>
          <Text style={styles.status}>{request.status}</Text>
        </View>
        <Text style={styles.title}>{request.title}</Text>
        
        <View style={styles.metaRow}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>{format(request.createdAt, 'MMM d, h:mm a')}</Text>
        </View>

        {request.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.body}>{request.description}</Text>
          </View>
        )}

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <Text style={styles.body}>{request.quantity || 'Not specified'}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Priority</Text>
            <Text style={[styles.body, { color: colors.priorityCritical, fontWeight: 'bold' }]}>{request.priority}</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.label}>Sync Timeline</Text>
      <Card style={styles.timelineCard}>
        <View style={styles.timelineItem}>
          <Activity size={16} color={colors.primary} />
          <Text style={styles.timelineText}>Created by {request.originDeviceId}</Text>
        </View>
        <View style={styles.timelineLine} />
        <View style={styles.timelineItem}>
          <Activity size={16} color={colors.info} />
          <Text style={styles.timelineText}>Status: {request.syncStatus}</Text>
        </View>
        <Text style={styles.smallMeta}>Version: {request.version}</Text>
        <Text style={styles.smallMeta}>Request ID: {request.id}</Text>
      </Card>

      <Text style={styles.label}>Update Status</Text>
      <View style={styles.buttonGroup}>
        <Button 
          title="Open"
          variant={request.status === 'Open' ? 'primary' : 'outline'}
          onPress={() => handleUpdateStatus('Open')}
          style={styles.actionButton}
        />
        <Button 
          title="In Progress"
          variant={request.status === 'In Progress' ? 'primary' : 'outline'}
          onPress={() => handleUpdateStatus('In Progress')}
          style={styles.actionButton}
        />
        <Button 
          title="Fulfilled"
          variant={request.status === 'Fulfilled' ? 'primary' : 'outline'}
          onPress={() => handleUpdateStatus('Fulfilled')}
          style={styles.actionButton}
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  type: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  status: {
    ...typography.caption,
    fontWeight: 'bold',
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.m,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  metaText: {
    ...typography.bodySecondary,
    marginLeft: spacing.xs,
  },
  section: {
    marginTop: spacing.m,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  body: {
    ...typography.body,
  },
  row: {
    flexDirection: 'row',
    marginTop: spacing.m,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  col: {
    flex: 1,
  },
  label: {
    ...typography.body,
    fontWeight: 'bold',
    marginTop: spacing.xl,
    marginBottom: spacing.s,
  },
  timelineCard: {
    backgroundColor: '#fff',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 7,
    marginVertical: 4,
  },
  timelineText: {
    ...typography.bodySecondary,
    marginLeft: spacing.s,
  },
  smallMeta: {
    ...typography.caption,
    marginTop: spacing.m,
    color: colors.textSecondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs / 2,
    paddingVertical: spacing.s,
  }
});
