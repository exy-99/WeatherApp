import React from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import Icon from './Icon';
import { colors } from '../../constants/colors';

interface OutlinedButtonProps {
  label: string;
  icon?: string;
  variant?: 'green' | 'red';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function OutlinedButton({ label, icon, variant = 'green', onPress, style }: OutlinedButtonProps) {
  const color = variant === 'red' ? colors.destructive : colors.primary;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
      <View
        className="flex-row items-center justify-center rounded-full px-4 py-3 gap-1.5"
        style={{ minHeight: 44, borderWidth: 1.5, borderColor: color }}
      >
        {icon ? <Icon name={icon} size={18} color={color} /> : null}
        <Text className="text-base font-bold" style={{ color }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}