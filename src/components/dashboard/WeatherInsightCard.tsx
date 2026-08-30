import React from 'react';
import { Image, Text, View } from 'react-native';
import Card from '../ui/Card';
import PillChip from '../ui/PillChip';
import Icon from '../ui/Icon';
import { InsightChip } from '../../types/dashboard';
import { colors } from '../../constants/colors';

interface WeatherInsightCardProps {
  temp: number;
  condition: string;
  icon: string;
  precipitation: number;
  high: number;
  low: number;
  insights: InsightChip[];
  onInsightPress?: (chipId: string) => void;
}

function WeatherInsightCard({
  temp,
  condition,
  icon,
  precipitation,
  high,
  low,
  insights,
  onInsightPress,
}: WeatherInsightCardProps) {
  return (
    <Card className="flex-row">
      <View className="flex-1">
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
          className="h-16 w-16"
        />
        <Text
          className="mt-1 text-5xl font-bold"
          style={{ color: colors.textPrimary }}
        >
          {Math.round(temp)}°
        </Text>
        <Text
          className="mt-1 text-base capitalize"
          style={{ color: colors.textSecondary }}
        >
          {condition}
        </Text>
        <View className="mt-1 flex-row items-center">
          <Icon name="water-outline" size={12} color={colors.textSecondary} />
          <Text className="ml-1 text-xs" style={{ color: colors.textSecondary }}>
            {Math.round(precipitation * 100)}% precipitation
          </Text>
        </View>
        <Text className="mt-1 text-xs" style={{ color: colors.textMuted }}>
          ↑{Math.round(high)}°  ↓{Math.round(low)}°
        </Text>
      </View>
      <View className="flex-1">
        <Text
          className="text-[10px] font-bold uppercase tracking-wide"
          style={{ color: colors.primaryDark }}
        >
          TODAY'S INSIGHTS
        </Text>
        <View className="mt-2 gap-2">
          {insights.map(chip => (
            <PillChip
              key={chip.id}
              label={chip.label}
              icon={chip.icon}
              variant={chip.variant}
              onPress={() => onInsightPress?.(chip.id)}
            />
          ))}
        </View>
      </View>
    </Card>
  );
}

export default WeatherInsightCard;