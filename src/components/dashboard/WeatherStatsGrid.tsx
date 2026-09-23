import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import ProgressBar from '../ui/ProgressBar';
import { colors } from '../../constants/colors';
import { StatMetric } from '../../types/dashboard';

interface WeatherStatsGridProps {
  stats: StatMetric[];
}

function StatCard({ stat }: { stat: StatMetric }) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: reducedMotion ? [] : [{ scale: scale.value }],
  }));
  return (
    <Animated.View
      style={[styles.statCard, animatedStyle]}
      onTouchStart={() => {
        'worklet';
        scale.value = withSpring(0.97);
      }}
      onTouchEnd={() => {
        'worklet';
        scale.value = withSpring(1);
      }}
      accessibilityRole="none"
    >
      <Card className="w-full" style={styles.cardPadding}>
        <View className="flex-row items-center justify-between">
          <Icon name={stat.icon} size={18} color={colors.primaryDark} />
          <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
            {stat.value}
          </Text>
        </View>
        <Text className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
          {stat.label}
        </Text>
        <View className="mt-2">
          <ProgressBar progress={stat.progress} height={4} />
        </View>
      </Card>
    </Animated.View>
  );
}

function WeatherStatsGrid({ stats }: WeatherStatsGridProps) {
  return (
    <View className="flex-row flex-wrap">
      {stats.map(stat => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: { marginBottom: 8, width: '48%' },
  cardPadding: { padding: 12 },
});

export default WeatherStatsGrid;