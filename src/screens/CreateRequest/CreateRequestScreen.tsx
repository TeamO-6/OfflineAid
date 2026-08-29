import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

import { colors, spacing, typography, borderRadius } from '../../config/theme';
import { Button } from '../../components/Button';
import { RequestRepository } from '../../database/repositories/RequestRepository';
import { ReliefRequest, PriorityLevel } from '../../models/Request';
import { syncManager } from '../../services/sync/SyncManager';

export const CreateRequestScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Medical');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('High');

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a request title');
      return;
    }

    const newRequest: ReliefRequest = {
      id: uuidv4(),
      type,
      title,
      description,
      quantity: quantity ? parseInt(quantity, 10) : undefined,
      priority,
      status: 'Open',
      originDeviceId: syncManager.getMyDeviceId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      syncStatus: 'PENDING',
    };

    try {
      await RequestRepository.create(newRequest);
      Alert.alert('Success', 'Emergency request created and saved locally.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save request locally.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Request Title *</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g. Need Drinking Water"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Type *</Text>
      <View style={styles.buttonGroup}>
        {['Medical', 'Water', 'Food', 'Shelter', 'Rescue'].map(t => (
          <Button 
            key={t} 
            title={t} 
            variant={type === t ? 'primary' : 'outline'}
            onPress={() => setType(t)}
            style={styles.groupButton}
            textStyle={{ fontSize: 12 }}
          />
        ))}
      </View>

      <Text style={styles.label}>Priority *</Text>
      <View style={styles.buttonGroup}>
        {(['Low', 'Medium', 'High', 'Critical'] as PriorityLevel[]).map(p => (
          <Button 
            key={p} 
            title={p} 
            variant={priority === p ? 'primary' : 'outline'}
            onPress={() => setPriority(p)}
            style={styles.groupButton}
            textStyle={{ fontSize: 12 }}
          />
        ))}
      </View>

      <Text style={styles.label}>Quantity (Optional)</Text>
      <TextInput 
        style={styles.input}
        placeholder="e.g. 100"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput 
        style={[styles.input, styles.textArea]}
        placeholder="Provide more details..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Button 
        title="Save Request"
        onPress={handleSubmit}
        style={styles.submitButton}
      />
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
  label: {
    ...typography.body,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    marginTop: spacing.m,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs / 2,
  },
  groupButton: {
    marginHorizontal: spacing.xs / 2,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.s,
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  }
});
