import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import AnimatedPressable from './AnimatedPressable';
import Icon from './Icon';
import { colors } from '../../constants/colors';

interface PillChipProps {
  label: string;
  icon?: string;
  variant: 'primary' | 'secondary' | 'warning';
  onPress?: () => void;
  accessibilityLabel?: string;
}

interface PillChipVariant {
  backgroundColor?: string;
  borderColor?: string;
  textColor: string;
}

const VARIANTS: Record<PillChipProps['variant'], PillChipVariant> = {
  primary: { backgroundColor: colors.primaryDark, textColor: colors.white },
  secondary: { borderColor: colors.primary, textColor: colors.primary },
  warning: { borderColor: colors.destructive, textColor: colors.destructive },
};

export default function PillChip({ label, icon, variant, onPress, accessibilityLabel }: PillChipProps) {
  const variantStyle = VARIANTS[variant];
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: reducedMotion ? [] : [{ scale: scale.value }],
  }));
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        'worklet';
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        'worklet';
        scale.value = withSpring(1);
      }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        { opacity: pressed ? 0.6 : 1 },
        { minHeight: 44 },
        { backgroundColor: variantStyle.backgroundColor },
        { borderWidth: variantStyle.borderColor ? 1.5 : 0, borderColor: variantStyle.borderColor },
      ]}
      className="flex-row items-center rounded-full px-4 py-2.5 gap-1.5"
    >
      <Animated.View
        style={[styles.iconLabelRow, animatedStyle]}
      >
        {icon ? <Icon name={icon} size={16} color={variantStyle.textColor} /> : null}
        <Text className="text-sm font-medium" style={[styles.label, { color: variantStyle.textColor }]}>
          {label}
        </Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  iconLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: {},
});