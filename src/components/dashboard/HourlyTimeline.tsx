import React from 'react';
import { ScrollView, Text } from 'react-native';
import Animated, {
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Card from '../ui/Card';
import HourlyCard from './HourlyCard';
import { ForecastItem } from '../../types/weather';
import { colors } from '../../constants/colors';

interface HourlyTimelineProps {
  hours: ForecastItem[];
}

function AnimatedHourlyCard({ item, index }: { item: ForecastItem; index: number }) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(
    reducedMotion
      ? 1
      : withDelay(index * 40, withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })),
  );
  const animatedStyle = useDerivedValue(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 8 }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <HourlyCard item={item} />
    </Animated.View>
  );
}

function HourlyTimeline({ hours }: HourlyTimelineProps) {
  return (
    <Card>
      <Text className="text-xs font-bold uppercase" style={{ color: colors.primaryDark }}>
        NEXT 24 HOURS
      </Text>
      {hours.length === 0 ? (
        <Text className="mt-2 text-xs" style={{ color: colors.textMuted }}>
          Hourly forecast unavailable
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {hours.map((item, index) => (
            <AnimatedHourlyCard key={item.dt} item={item} index={index} />
          ))}
        </ScrollView>
      )}
    </Card>
  );
}

export default HourlyTimeline;