import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', style, textStyle }) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'primary': return { backgroundColor: colors.primary };
      case 'secondary': return { backgroundColor: colors.secondary };
      case 'outline': return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary };
      default: return { backgroundColor: colors.primary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline': return { color: colors.primary };
      default: return { color: colors.surface };
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getBackgroundStyle(), style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.s,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
