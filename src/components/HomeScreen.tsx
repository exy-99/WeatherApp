import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentWeather, getDailyWeather, reverseGeocode } from '../api/weatherapi';
import { CurrentWeatherResponse, DailyForecastItem } from '../types/weather';
import { useLocation } from '../hooks/useLocation';
import HomeIsland from './HomeIsland';
import ForecastTabs from './ForecastTabs';

function HomeScreen() {
  const { coords, loading: locationLoading, error: locationError, loadLocation } =
    useLocation();
  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null);
  const [daily, setDaily] = useState<DailyForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayLocation, setDisplayLocation] = useState<string>('');

  const loadWeather = useCallback(async () => {
    if (!coords) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [currentData, dailyData, geoLocation] = await Promise.all([
        getCurrentWeather(coords.latitude, coords.longitude),
        getDailyWeather(coords.latitude, coords.longitude),
        reverseGeocode(coords.latitude, coords.longitude),
      ]);
      setCurrent(currentData);
      setDaily(dailyData);
      setDisplayLocation(geoLocation);
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

  const location = displayLocation || `${current.name}, ${current.sys.country}`;
  const today = daily[0];

  return (
    <View className="flex-1 bg-sky-400">
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          <View className="flex-[2]">
            <HomeIsland
              location={location}
              temp={current.main.temp}
              condition={current.weather[0]?.description ?? ''}
              icon={current.weather[0]?.icon ?? ''}
              high={today?.temp.max ?? current.main.temp_max}
              low={today?.temp.min ?? current.main.temp_min}
              feelsLike={current.main.feels_like}
              humidity={current.main.humidity}
              windSpeed={current.wind.speed}
              windDeg={current.wind.deg}
              pressure={current.main.pressure}
            />
          </View>
          <View className="flex-[3]">
            <ForecastTabs days={daily.slice(0, 3)} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;
