import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentWeather, getDailyWeather } from '../api/weatherapi';
import { CurrentWeatherResponse, DailyForecastItem } from '../types/weather';
import { useLocation } from '../hooks/useLocation';

function HomeScreen() {
  const { coords, loading: locationLoading, error: locationError, loadLocation } =
    useLocation();
  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null);
  const [daily, setDaily] = useState<DailyForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    if (!coords) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [currentData, dailyData] = await Promise.all([
        getCurrentWeather(coords.latitude, coords.longitude),
        getDailyWeather(coords.latitude, coords.longitude),
      ]);
      setCurrent(currentData);
      setDaily(dailyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    if (coords) {
      loadWeather();
    }
  }, [coords, loadWeather]);

  const isLoading = locationLoading || loading;
  const errorMessage = locationError ?? error;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-sky-400">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (errorMessage || !current) {
    return (
      <View className="flex-1 items-center justify-center bg-sky-400 px-8">
        <Text className="text-white text-lg text-center mb-4">
          {errorMessage ?? 'Weather data is unavailable'}
        </Text>
        <TouchableOpacity
          className="bg-white px-6 py-2 rounded-full"
          onPress={async () => {
            setError(null);
            await loadLocation();
          }}
        >
          <Text className="text-sky-600 font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const now = current;

  return (
    <ScrollView className="flex-1 bg-sky-400">
      <SafeAreaView className="flex-1">
        <View className="p-6">
          <Text className="text-white text-2xl font-bold text-center">
            {now.name}
          </Text>
          {now && (
            <View className="items-center my-6">
              <Text className="text-white text-7xl font-bold">
                {Math.round(now.main.temp)}°
              </Text>
              <Text className="text-white text-xl capitalize">
                {now.weather[0]?.description ?? ''}
              </Text>
              <Text className="text-white mt-2">
                Feels like {Math.round(now.main.feels_like)}° · Humidity{' '}
                {now.main.humidity}%
              </Text>
            </View>
          )}

          {daily.length > 0 && (
            <View className="bg-white/20 rounded-2xl p-4 mb-4">
              <Text className="text-white font-semibold mb-2">
                Daily Forecast
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
                    {item.weather[0]?.description ?? ''}
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

export default HomeScreen;
