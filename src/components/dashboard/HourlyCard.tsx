import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ForecastItem } from '../../types/weather';
import { colors } from '../../constants/colors';

interface HourlyCardProps {
  item: ForecastItem;
}

function HourlyCard({ item }: HourlyCardProps) {
  const time = new Date(item.dt * 1000).toLocaleTimeString([], {
    hour: 'numeric',
  });
  const precip = Math.round((item.pop ?? 0) * 100);
  const precipColor = item.pop > 0.3 ? colors.primary : colors.textMuted;

  return (
    <View
      className="w-16 items-center rounded-2xl p-2.5"
      style={styles.card}
    >
      <Text className="text-xs" style={styles.time}>
        {time}
      </Text>
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${item.weather[0]?.icon}@2x.png`,
        }}
        className="h-9 w-9"
      />
      <Text className="text-sm font-bold" style={styles.temp}>
        {Math.round(item.main.temp)}°
      </Text>
      <Text className="text-[10px]" style={[styles.precip, { color: precipColor }]}>
        {precip}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  time: { color: colors.textSecondary },
  temp: { color: colors.textPrimary },
  precip: {},
});

export default HourlyCard;