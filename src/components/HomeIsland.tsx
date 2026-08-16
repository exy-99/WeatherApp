import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';

export interface HomeIslandProps {
  location: string;
  temp: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  pressure: number;
  onLocationPress?: () => void;
}

function HomeIsland({
  location,
  temp,
  condition,
  icon,
  high,
  low,
  onLocationPress,
}: HomeIslandProps) {
  return (
    <View className="flex-1 bg-white/20 rounded-[2.5rem] p-6 m-4 mb-2 justify-between">
      <View className="items-center">
        <TouchableOpacity onPress={onLocationPress} className="w-full" activeOpacity={0.7}>
          <Text className="text-white text-2xl font-bold text-center">
            {location}
          </Text>
        </TouchableOpacity>
        <Text className="text-white/70 text-sm mt-1">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>

      <View className="items-center my-2">
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
          className="w-20 h-20"
        />
        <Text className="text-white text-7xl font-bold leading-none">
          {Math.round(temp)}°
        </Text>
        <Text className="text-white text-xl capitalize mt-1">{condition}</Text>
        <Text className="text-white/80 mt-2">
          H: {Math.round(high)}° L: {Math.round(low)}°
        </Text>
      </View>
    </View>
  );
}

export default HomeIsland;
