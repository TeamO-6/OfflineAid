import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows, borderRadius, spacing } from '../config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginVertical: spacing.s,
    ...shadows.sm,
  }
});
