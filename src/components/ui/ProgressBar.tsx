import React from 'react';
import { View } from 'react-native';
import { colors } from '../../constants/colors';

interface ProgressBarProps {
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
}

export default function ProgressBar({
  progress,
  color = colors.primary,
  trackColor = colors.primaryLight,
  height = 6,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return (
    <View
      className="w-full rounded-full overflow-hidden"
      style={{ height, backgroundColor: trackColor }}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height,
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}