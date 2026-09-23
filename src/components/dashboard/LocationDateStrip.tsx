import React from 'react';
import { Text, View } from 'react-native';
import Icon from '../ui/Icon';
import { colors } from '../../constants/colors';

interface LocationDateStripProps {
  location: string;
  date?: string;
}

function LocationDateStrip({ location, date }: LocationDateStripProps) {
  const dateLabel =
    date ??
    new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

  return (
    <View className="flex-row items-center justify-between px-5">
      <View className="flex-row items-center">
        <Icon name="MapPin" size={14} color={colors.textMuted} />
        <Text
          className="ml-1 text-xs font-medium"
          style={{ color: colors.textMuted }}
        >
          {location}
        </Text>
      </View>
      <Text className="text-xs" style={{ color: colors.textMuted }}>
        {dateLabel}
      </Text>
    </View>
  );
}

export default LocationDateStrip;