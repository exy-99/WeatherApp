import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  getCurrentWeather,
  getDailyWeather,
} from './src/api/weatherapi';
import {
  currentWeatherData,
  DailyWeatherData,
} from './src/types/weather';

const DEFAULT_LAT = 51.5072;
const DEFAULT_LON = -0.1276;

function HomeScreen() {
  const [current, setCurrent] = useState<currentWeatherData[]>([]);
  const [daily, setDaily] = useState<DailyWeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const [currentData, dailyData] = await Promise.all([
        getCurrentWeather(DEFAULT_LAT, DEFAULT_LON),
        getDailyWeather(DEFAULT_LAT, DEFAULT_LON),
      ]);
      setCurrent(currentData);
      setDaily(dailyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-sky-400">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-sky-400 px-8">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-white px-6 py-2 rounded-full"
          onPress={loadWeather}
        >
          <Text className="text-sky-600 font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const now = current[0];
  const today = daily[0];

  return (
    <ScrollView className="flex-1 bg-sky-400">
      <SafeAreaView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold text-center">
            London
          </Text>
          {now && (
            <View className="items-center my-6">
              <Text className="text-white text-7xl font-bold">
                {Math.round(now.temp)}°
              </Text>
              <Text className="text-white mt-2">
                Feels like {Math.round(now.feels_like)}° · Humidity{' '}
                {now.humidity}%
              </Text>
            </View>
          )}

          {today && (
            <View className="bg-white/20 rounded-2xl p-4 mb-4">
              <Text className="text-white font-semibold mb-2">
                7-Day Forecast
              </Text>
              {daily.slice(0, 7).map(item => (
                <View
                  key={item.dt}
                  className="flex-row justify-between items-center py-2 border-b border-white/20"
                >
                  <Text className="text-white">
                    {new Date(item.dt * 1000).toLocaleDateString(undefined, {
                      weekday: 'short',
                    })}
                  </Text>
                  <Text className="text-white capitalize">
                    {item.weather?.[0]?.description ?? ''}
                  </Text>
                  <Text className="text-white">
                    {Math.round(item.temp.max)}° / {Math.round(item.temp.min)}°
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
