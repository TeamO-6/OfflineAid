import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Settings, User, Database, Info, LogOut } from 'lucide-react-native';

import { colors, spacing, typography, borderRadius } from '../../config/theme';
import { APP_CONFIG } from '../../config/appConfig';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { syncManager } from '../../services/sync/SyncManager';

export const SettingsScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={32} color={colors.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Relief Worker</Text>
          <Text style={styles.profileId}>ID: {syncManager.getMyDeviceId()}</Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>App Info</Text>
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Name</Text>
          <Text style={styles.infoValue}>{APP_CONFIG.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>{APP_CONFIG.version}</Text>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Danger Zone</Text>
      <Card style={styles.dangerCard}>
        <Button 
          title="Clear Local Database"
          variant="outline"
          onPress={() => Alert.alert('Warning', 'This will delete all local requests.')}
          textStyle={{ color: colors.error }}
        />
      </Card>

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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,102,204,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: spacing.m,
  },
  profileName: {
    ...typography.h2,
  },
  profileId: {
    ...typography.bodySecondary,
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.m,
    marginLeft: spacing.xs,
  },
  infoCard: {
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.s,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body,
    fontWeight: 'bold',
  },
  dangerCard: {
    borderColor: colors.error,
    borderWidth: 1,
  }
});
