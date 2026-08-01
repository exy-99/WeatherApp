import React from 'react';
import { Image, Text, View } from 'react-native';
import { DailyForecastItem } from '../types/weather';

export interface DayDetailPanelProps {
  item: DailyForecastItem;
  title: string;
}

const STAT_STYLES =
  'flex-1 flex-row items-center justify-between rounded-2xl bg-white/20 px-4 py-3';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="text-white/70 text-xs">{label}</Text>
      <Text className="text-white font-semibold text-base mt-0.5">{value}</Text>
    </View>
  );
}

function DayDetailPanel({ item, title }: DayDetailPanelProps) {
  const date = new Date(item.dt * 1000);
  const condition = item.weather[0];

  return (
    <View className="bg-white/20 rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white font-bold text-lg">{title}</Text>
        <Text className="text-white/70 text-sm">
          {date.toLocaleDateString(undefined, {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          })}
        </Text>
      </View>

      <View className="items-center py-2 mb-3">
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${condition?.icon}@2x.png` }}
          className="w-16 h-16"
        />
        <Text className="text-white text-3xl font-bold mt-1">
          {Math.round(item.temp.max)}° / {Math.round(item.temp.min)}°
        </Text>
        <Text className="text-white capitalize mt-1">
          {condition?.description ?? ''}
        </Text>
      </View>

      <View className="gap-2">
        <View className={STAT_STYLES}>
          <Stat label="Feels like" value={`${Math.round(item.feels_like)}°`} />
          <View className="w-px h-8 bg-white/20 mx-3" />
          <Stat label="Humidity" value={`${item.humidity}%`} />
        </View>
        <View className={STAT_STYLES}>
          <Stat
            label="Wind"
            value={`${item.wind_deg}° ${Math.round(item.wind_speed)} m/s`}
          />
          <View className="w-px h-8 bg-white/20 mx-3" />
          <Stat label="Pressure" value={`${item.pressure} hPa`} />
        </View>
        <View className={STAT_STYLES}>
          <Stat label="Precipitation" value={`${Math.round(item.pop * 100)}%`} />
        </View>
      </View>
    </View>
  );
}

export default DayDetailPanel;
