import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from './Icon';
import { colors } from '../../constants/colors';

interface GradientButtonProps {
  label: string;
  icon?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function GradientButton({ label, icon, onPress, style }: GradientButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
      <LinearGradient
        colors={colors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-row items-center justify-center rounded-full px-4 py-3 gap-1.5"
        style={{ minHeight: 44 }}
      >
        {icon ? <Icon name={icon} size={18} color={colors.white} /> : null}
        <Text className="text-base font-bold text-white">{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}