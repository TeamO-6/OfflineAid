import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Settings, User, Database, Info, Edit3, ShieldAlert, Cpu } from 'lucide-react-native';

import { colors, spacing, typography, borderRadius } from '../../config/theme';
import { APP_CONFIG } from '../../config/appConfig';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { syncManager } from '../../services/sync/SyncManager';

export const SettingsScreen = () => {
  const [name, setName] = useState('Relief Worker');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Premium Profile Header */}
      <View style={styles.headerBanner}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={36} color={colors.primary} />
          </View>
          <View style={styles.activeBadge} />
        </View>
        <View style={styles.profileHeaderInfo}>
          {isEditing ? (
            <TextInput 
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <TouchableOpacity style={styles.nameRow} onPress={() => setIsEditing(true)}>
              <Text style={styles.profileName}>{name}</Text>
              <Edit3 size={16} color={colors.textSecondary} style={{marginLeft: 8}} />
            </TouchableOpacity>
          )}
          <Text style={styles.profileBadge}>Offline Node Active</Text>
        </View>
      </View>

      {/* Device Identity */}
      <Text style={styles.sectionTitle}>Device Identity</Text>
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.iconLabelRow}>
            <Cpu size={20} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>Node ID</Text>
          </View>
          <Text style={styles.infoValue}>{syncManager.getMyDeviceId()}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <View style={styles.iconLabelRow}>
            <Info size={20} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>App Version</Text>
          </View>
          <Text style={styles.infoValue}>{APP_CONFIG.version}</Text>
        </View>
      </Card>

      {/* Danger Zone */}
      <Text style={styles.sectionTitle}>System Administration</Text>
      <Card style={[styles.infoCard, styles.dangerCard]}>
        <View style={styles.dangerHeader}>
          <ShieldAlert size={24} color={colors.error} />
          <View style={{marginLeft: 12}}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <Text style={styles.dangerDesc}>Irreversible system actions</Text>
          </View>
        </View>
        <Button 
          title="Wipe Local Database"
          variant="outline"
          onPress={() => Alert.alert('Wipe Database', 'Are you absolutely sure? All unsynced local data will be permanently destroyed.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Wipe Data', style: 'destructive', onPress: () => console.log('Wiped') }
          ])}
          textStyle={{ color: colors.error }}
          style={{marginTop: spacing.m, borderColor: colors.error}}
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
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.l,
    borderRadius: borderRadius.l,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,102,204,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileHeaderInfo: {
    marginLeft: spacing.l,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    ...typography.h2,
    color: colors.text,
  },
  nameInput: {
    ...typography.h2,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    padding: 0,
    margin: 0,
  },
  profileBadge: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: 'rgba(0,102,204,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.m,
    marginLeft: spacing.xs,
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
  },
  infoCard: {
    marginBottom: spacing.xl,
    padding: spacing.m,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.s,
  },
  infoValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  dangerCard: {
    backgroundColor: 'rgba(255,59,48,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.2)',
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerTitle: {
    ...typography.h3,
    color: colors.error,
  },
  dangerDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  }
});
